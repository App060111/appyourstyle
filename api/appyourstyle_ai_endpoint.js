export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    result: "Legacy API deaktiviert."
  });
}
