import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secret = process.env.SIGNATURE_ENCRYPTION_SECRET!;

// Create 32-byte key
const key = crypto.createHash("sha256").update(secret).digest();

export function encrypt(data: object) {
	const iv = crypto.randomBytes(12); // GCM recommended
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);

	const tag = cipher.getAuthTag();

	return {
		iv: iv.toString("hex"),
		content: encrypted.toString("hex"),
		tag: tag.toString("hex"),
	};
}
