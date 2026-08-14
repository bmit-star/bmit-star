import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createRequire } from "module";
import type { NextFunction, Request, Response } from "express";
import { getAdminAuth } from "./src/lib/firebase-admin";

dotenv.config({ override: true });

// Cloudinary credentials must be configured through environment variables.
if (process.env.CLOUDINARY_URL) {
  process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL.trim().replace(/^["']|["']$/g, '');
}

const getRequire = () => {
  if (typeof require !== "undefined") return require;
  return createRequire(import.meta.url);
};
const customRequire = getRequire();
const cloudinary = customRequire("cloudinary").v2;

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Админ нэвтрэлт шаардлагатай." });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const allowedEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const hasAdminClaim = decoded.admin === true;
    const emailAllowed = Boolean(decoded.email && allowedEmails.includes(decoded.email.toLowerCase()));

    if (!hasAdminClaim && !emailAllowed) {
      return res.status(403).json({ success: false, error: "Энэ бүртгэл админ эрхгүй байна." });
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(401).json({ success: false, error: "Админ нэвтрэлт баталгаажсангүй." });
  }
};

// Configure Cloudinary Storage explicitly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Server-side Gemini AI setup
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

app.get("/api/auth/admin", requireAdmin, (_req, res) => {
  res.json({ success: true });
});

// -----------------------------------------------------------------------------
// CLOUDINARY STORAGE & 30-DAY RETENTION POLICY API ROUTES
// -----------------------------------------------------------------------------

// 1. Get Storage Policy Config & Status
app.get("/api/cloudinary/config", requireAdmin, (_req, res) => {
  res.json({
    success: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    retentionDays: 30,
    warningDaysBeforeExpiration: 5,
    status: "active",
    folderPrefix: "zallaga_invitations/",
    message: "Cloudinary сан холбогдсон. Захиалагч бүрийн дата 30 хоног хадгалагдана (25 дахь өдөр сануулга илгээнэ)."
  });
});

// 2. Upload Media file / Base64 to Cloudinary
app.post("/api/cloudinary/upload", requireAdmin, async (req, res) => {
  try {
    const { image, orderId, folderName, tags } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: "Зураг эсвэл файл оруулна уу." });
    }

    const folder = folderName || `zallaga_invitations/${orderId || 'general'}`;

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: "auto",
      tags: tags || ["zallaga_invitation", orderId || "unassigned"],
      transformation: [
        { quality: "auto", fetch_format: "webp" }
      ]
    });

    res.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      folder: uploadResult.folder,
      createdAt: uploadResult.created_at
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Cloudinary руу файл хуулахад алдаа гарлаа."
    });
  }
});

// 3. Automated Storage Cleanup & 5-Day Expiration Warning Check Endpoint
app.post("/api/cloudinary/cleanup-check", requireAdmin, async (req, res) => {
  try {
    const { orders } = req.body; // Array of Customer Orders
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, error: "Захиалгын жагсаалт буруу байна." });
    }

    const now = Date.now();
    const RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days in ms
    const WARNING_MS = 5 * 24 * 60 * 60 * 1000;   // 5 Days in ms

    const processedOrders = [];
    const logs = [];

    for (const order of orders) {
      const createdAtMs = new Date(order.createdAt || Date.now()).getTime();
      const expiresAtMs = createdAtMs + RETENTION_MS;
      const msRemaining = expiresAtMs - now;
      const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

      let storageStatus = order.storageStatus || 'active';
      let storageWarningSent = Boolean(order.storageWarningSent);
      let storageWarningSentAt = order.storageWarningSentAt;
      let notificationMessage = null;

      // Check if within 5-day warning window (between 0 and 5 days remaining)
      if (msRemaining <= WARNING_MS && msRemaining > 0) {
        storageStatus = 'warning';
        if (!storageWarningSent) {
          storageWarningSent = true;
          storageWarningSentAt = new Date().toISOString();
          notificationMessage = `⚠️ Сануулга: Таны "${order.invitationData?.eventTitle || 'Урилга'}" урилгын хадгалах сангийн хугацаа дуусахад ${daysRemaining} хоног үлдлээ! 30 хоног дуусахад медиа файлууд автоматаар устгагдах тул датагаа татаж авна уу.`;
          logs.push(`Order ${order.id} (${order.customerName}): 5-day expiration warning notification triggered (${daysRemaining} days left).`);
        }
      }
      // Check if expired (30 days reached)
      else if (msRemaining <= 0) {
        storageStatus = 'expired';
        try {
          // Attempt deleting folder on Cloudinary
          const folderPath = `zallaga_invitations/${order.id}`;
          await cloudinary.api.delete_resources_by_prefix(folderPath);
          logs.push(`Order ${order.id}: Cloudinary folder ${folderPath} resources automatically purged after 30 days.`);
        } catch (delErr: any) {
          console.warn(`Could not delete Cloudinary folder for order ${order.id}:`, delErr?.message);
        }
        notificationMessage = `🚨 Хадгалах сангийн хугацаа дууслаа: Таны урилгын медиа файлууд 30 хоногийн бодлогын дагуу цэвэрлэгдлээ.`;
      } else {
        storageStatus = 'active';
      }

      processedOrders.push({
        ...order,
        storageExpiresAt: new Date(expiresAtMs).toISOString(),
        storageStatus,
        storageWarningSent,
        storageWarningSentAt,
        daysRemaining,
        notificationTriggered: notificationMessage
      });
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      checkedCount: orders.length,
      processedOrders,
      logs
    });
  } catch (error: any) {
    console.error("Storage Cleanup Check Error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Хадгалах сангийн хугацаа шалгахад алдаа гарлаа."
    });
  }
});

// 4. Delete Customer Cloudinary Folder Endpoint
app.delete("/api/cloudinary/folder/:orderId", requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const folderPath = `zallaga_invitations/${orderId}`;
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    res.json({
      success: true,
      message: `Folder ${folderPath} storage cleared successfully.`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || "Фоल्डर устгахад алдаа гарлаа."
    });
  }
});

// 5. Custom Domain Configuration Endpoint for zallaga.art
app.get("/api/domain-config", (_req, res) => {
  res.json({
    success: true,
    domain: "zallaga.art",
    wwwDomain: "www.zallaga.art",
    appUrl: process.env.APP_URL || "https://ais-dev-m6tv7tkc7dkvfkexb3riyp-616372777675.asia-northeast1.run.app",
    sslStatus: "Auto-provisioned (Let's Encrypt / Google Managed Certificate)",
    dnsRecords: [
      {
        type: "A",
        host: "@",
        name: "zallaga.art",
        value: "216.239.32.21",
        ttl: 3600,
        description: "Cloud Run Anycast IPv4 Primary"
      },
      {
        type: "A",
        host: "@",
        name: "zallaga.art",
        value: "216.239.34.21",
        ttl: 3600,
        description: "Cloud Run Anycast IPv4 Secondary"
      },
      {
        type: "A",
        host: "@",
        name: "zallaga.art",
        value: "216.239.36.21",
        ttl: 3600,
        description: "Cloud Run Anycast IPv4 Tertiary"
      },
      {
        type: "A",
        host: "@",
        name: "zallaga.art",
        value: "216.239.38.21",
        ttl: 3600,
        description: "Cloud Run Anycast IPv4 Quaternary"
      },
      {
        type: "CNAME",
        host: "www",
        name: "www.zallaga.art",
        value: "ghs.googlehosted.com.",
        ttl: 3600,
        description: "Subdomain Routing to Google Hosted Service"
      },
      {
        type: "TXT",
        host: "@",
        name: "zallaga.art",
        value: "google-site-verification=ais-m6tv7tkc7dkvfkexb3riyp",
        ttl: 3600,
        description: "Google Cloud Domain Verification"
      }
    ]
  });
});

// AI Assistant endpoint for Administrator helper functions
app.post("/api/ai/assistant", requireAdmin, async (req, res) => {
  try {
    const { action, prompt, tone, language, coupleInfo, category, aiCallCount } = req.body;

    // Check limit: Max 1-2 AI calls per invitation
    if (aiCallCount !== undefined && Number(aiCallCount) >= 2) {
      return res.status(400).json({
        success: false,
        error: "Урилга бүрт хамгийн ихдээ 2 удаа ИИ туслах ашиглах боломжтой (Хязгаар хүрсэн: 2/2).",
      });
    }

    const ai = getGenAIClient();

    let systemInstruction = "You are an expert Mongolian luxury copywriter for digital wedding and event invitations. Respond in fluent, grammatically flawless, highly elegant Mongolian language appropriate for luxury invitations. Never change layout or HTML structure.";
    let userPrompt = "";

    switch (action) {
      case "grammar":
        userPrompt = `Дараах монгол эх бичвэрийн зөв бичих дүрмийн болон уран найруулгын алдааг засаж, тансаг хүндэтгэлийн хэв маягтай болгон сайжруулж өгнө үү:\n"${prompt}"`;
        break;

      case "greeting":
        userPrompt = `Баяр ёслол, урилгын хүндэтгэлийн эхний мэндчилгээ, уриалга үгийг монгол хэлээр тансаг яруу байдлаар зохионо уу.
Эзний нэрс: ${coupleInfo?.bride || "Нэр 1"} ${coupleInfo?.groom ? "& " + coupleInfo.groom : ""}
Арга хэмжээ/Баяр: ${category || coupleInfo?.event || "Хуримын баяр"}
Өнгө аяс: ${tone || "Тансаг хүндэтгэлийн"}`;
        break;

      case "poem":
        userPrompt = `Дараах баяр ёслолд зориулсан 4 эсвэл 8 мөрт хүндэтгэлийн монгол ерөөл, билэгтэй уран шүлэг зохионо уу:
Арга хэмжээ / Баяр: ${category || coupleInfo?.event || "Хуримын баяр"}
Эздийн нэрс: ${coupleInfo?.bride || "Нэр 1"} ${coupleInfo?.groom ? "& " + coupleInfo.groom : ""}
Өнгө аяс: ${tone || "Яруу содон, бэлэгдэлтэй"}`;
        break;

      case "translate":
        userPrompt = `Дараах урилгын эх бичвэрийг ${language || "English"} хэл рүү урилгын хүндэтгэлийн өнгө аясыг хадгалан уран яруугаар орчуулна уу:\n"${prompt}"`;
        break;

      case "shorten":
        userPrompt = `Дараах урилгын эх бичвэрийг утга агуулгыг нь алдагдуулахгүйгээр утасны дэлгэц дээр харагдахад тохиромжтой, богино бөгөөд оновчтой болгон товчилж засна уу:\n"${prompt}"`;
        break;

      case "template_fill":
        systemInstruction = `You are an expert event planner for Mongolian digital invitations. Return ONLY a valid JSON object without markdown fences, with exact keys: "eventTitle", "invitationMessage", "blessingText", "dressCodeTitle", "dressCodeDesc", "scheduleHighlights" (array of objects with "time" and "title").`;
        userPrompt = `Дараах баяр ёслолын урилгад зориулж 1-кликийн бүрэн авто-бөглөлтийн мэдээллийг монгол хэлээр бэлтгэж өгнө үү:
Баярын Ангилал: ${category || "Хурим"}
Эздийн нэрс: ${coupleInfo?.bride || "Нэр 1"} & ${coupleInfo?.groom || "Нэр 2"}
Нэмэлт тэмдэглэл: ${prompt || "Тансаг хүндэтгэлийн арга хэмжээ"}

Буцаах JSON формат жишээ:
{
  "eventTitle": "Ганзориг ба Номин нарын хуримын баяр",
  "invitationMessage": "Эцэг эхийн нэрэмжит хуримын баярт маань хүрэлцэн ирж, залуу хосод сэтгэлийн ерөөлөө өргөхийг урьж байна.",
  "blessingText": "Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.",
  "dressCodeTitle": "Гоёлын хувцас / Элегант",
  "dressCodeDesc": "Эрхэм зочид та бүхэн гоёлын даашинз, костюм эсвэл үндэсний дээлээр гоёно уу.",
  "scheduleHighlights": [
    {"time": "16:00", "title": "Зочдыг угтан авах"},
    {"time": "18:00", "title": "Хүндэтгэлийн зоог ба тоглолт"}
  ]
}`;
        break;

      case "generate_invitation_text":
        userPrompt = `Generate a high-end luxury wedding invitation message for:
Bride: ${coupleInfo?.bride || "Bride Name"}
Groom: ${coupleInfo?.groom || "Groom Name"}
Tone: ${tone || "Warm & Romantic"}
Event: ${coupleInfo?.event || "Wedding Ceremony"}
Provide a complete invitation message with a header quote, body text, and closing wording in Mongolian.`;
        break;

      case "rewrite_text":
        userPrompt = `Rewrite the following invitation text into a ${tone || "Luxury Formal"} tone while keeping key names and details accurate:
"${prompt}"`;
        break;

      case "generate_blessing":
        userPrompt = `Generate a beautiful, inspiring 2-sentence blessing quote for a marriage or event celebration in Mongolian. Tone: ${tone || "Poetic & Elegant"}.`;
        break;

      default:
        userPrompt = prompt || "Хуримын урилгын текст засах";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, result: response.text });
  } catch (err: any) {
    console.error("AI Assistant API Error:", err);
    res.status(500).json({
      success: false,
      error: err?.message || "ИИ туслах ажиллахад алдаа гарлаа.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  startServer();
}

export default app;
