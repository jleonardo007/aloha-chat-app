function validateImage(image) {
  const allowedExtensions = ["jpeg", "jpg", "png", "webp"];
  const fileExtension = image.name.split(".").pop();

  if (!allowedExtensions.includes(fileExtension)) return false;
  else return true;
}

export default validateImage;
