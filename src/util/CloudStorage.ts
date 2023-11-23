import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const bucket = storage.bucket("merchant-uploads");

export default function uploadFile(file: Express.Multer.File, merchantId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(
      merchantId + "/" + new Date().toISOString() + "/" + originalname.replace(/ /g, "_")
    );
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        resolve(publicUrl);
      })
      .on("error", err => {
        reject(err.message || `Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
}
