import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secret = process.env.NEXT_PUBLIC_SIGNATURE_ENCRYPTION_SECRET!;

const key = crypto.createHash("sha256").update(secret).digest();

export function decrypt(encrypted: { iv: string; content: string; tag: string }) {
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encrypted.iv, "hex"));

	decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));

	const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted.content, "hex")), decipher.final()]);

	return JSON.parse(decrypted.toString("utf8"));
}
