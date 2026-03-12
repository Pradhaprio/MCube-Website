export async function uploadImages(req, res) {
  const files = req.files || [];
  return res.status(201).json({
    files: files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }))
  });
}
