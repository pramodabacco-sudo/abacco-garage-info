//client\src\components\ImagePopup.jsx
const ImagePopup = ({
  images,
  selectedImage,
  setSelectedImage,
}) => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-3 md:p-6 overflow-hidden">

      {/* Close Button */}
      <button
        onClick={() =>
          setSelectedImage(null)
        }
        className="absolute top-3 right-4 md:top-5 md:right-5 text-white text-4xl z-50"
      >
        ×
      </button>

      {/* Popup Content */}
      <div className="max-w-5xl w-full flex flex-col items-center">

        {/* Main Image */}
        <div className="w-full bg-black rounded overflow-hidden flex items-center justify-center">

          <img
            src={selectedImage}
            alt="Garage"
            className="w-full max-h-[65vh] md:max-h-[80vh] object-contain"
          />

        </div>

        {/* Thumbnail Images */}
        <div className="flex gap-3 mt-4 overflow-x-auto w-full pb-2">

          {images.map((img) => (

            <img
              key={img.id}
              src={img.imageUrl}
              alt="Garage"
              onClick={() =>
                setSelectedImage(
                  img.imageUrl
                )
              }
              className={`w-16 h-16 md:w-24 md:h-24 object-cover cursor-pointer border-2 shrink-0 transition-all duration-200 rounded ${
                selectedImage ===
                img.imageUrl
                  ? "border-white scale-105"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            />

          ))}

        </div>

      </div>
    </div>
  );
};

export default ImagePopup;