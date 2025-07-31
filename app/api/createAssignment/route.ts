import cloudinary from "@/lib/config";
import { dbConnect } from "@/lib/db";
import assignmentModel from "@/models/Assignment";
import { NextApiRequest, NextApiResponse } from "next";
import { upload } from "@/lib/multer";

export const config = {
  api: { bodyParser: false },
};

const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(reject);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    title,
    subject,
    assignedTo,
    assignedBy,
    totalMarks,
    isSubmissionInClass,
    isSubmissionOpen,
  } = await req.body();

  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }
  await runMiddleware(req, res, upload.single("file"));
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  await dbConnect();

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: "question-bank",
            public_id: Date.now().toString(),
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(file.buffer);
    });
    const result = uploadResult as any;

    const newAssignment = new assignmentModel({
      title,
      subject,
      assignedTo,
      assignedBy,
      totalMarks,
      questionPaperLink: result.secure_url,
      isSubmissionInClass,
      isSubmissionOpen,
    });

    await newAssignment.save();
    res
      .status(200)
      .json({ message: "Uploaded successfully", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", detail: error });
  }
}
