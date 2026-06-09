import ImagePopup from "../../components/ImagePopup";

const AdminGarageDetailsPopup = ({
  selectedGarage,
  setSelectedGarage,
  selectedImage,
  setSelectedImage,
}) => {
  if (!selectedGarage) return null;

  const getStatusLabel = (status) => {
    switch (status) {
      case "CONVERTED": return "Will Onboard / Subscribed";
      case "INTERESTED": return "Interested / Requesting Demo";
      case "FOLLOW_UP": return "Evaluating / Revisit Scheduled";
      case "PENDING": return "Pending Assessment";
      case "REJECTED": return "Declined / No Interest";
      default: return status;
    }
  };

  return (
    <>
      {/* Background Mask Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
        
        {/* Backdrop Dismiss Anchor target */}
        <div className="absolute inset-0" onClick={() => setSelectedGarage(null)} />

        {/* Primary Content Sheet Card */}
        <div className="bg-white w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] rounded-xl border border-neutral-200 shadow-2xl relative z-10 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header Bar Area */}
          <div className="p-5 sm:p-6 border-b border-neutral-200 pr-14 flex flex-col relative shrink-0">
            <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-bold block mb-1">
              — DISPATCH DOSSIER DATA —
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 break-words line-clamp-2">
              {selectedGarage.shopName}
            </h1>

            {/* Absolute Placed Responsive Close Action */}
            <button
              onClick={() => setSelectedGarage(null)}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all active:scale-95 text-sm"
              aria-label="Close popup"
            >
              ✕
            </button>
          </div>

          {/* Internal Scrollable Core Metrics Body */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 layer-scrolling">
            
            {/* Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 pb-6 border-b border-neutral-100">
              
              <div className="break-words">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Primary Location Address
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
                  {selectedGarage.address}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Contact Line Connection
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 font-mono tracking-wide">
                  {selectedGarage.phoneNumber}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Territory Operations Region
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium">
                  {selectedGarage.location || "Unassigned Sector"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Field Representative Agent
                </span>
                <p className="text-xs sm:text-sm text-neutral-900 font-bold">
                  {selectedGarage.employee?.name || "System Base"}
                </p>
              </div>

              <div className="overflow-hidden">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Agent Authentication Key
                </span>
                <p className="text-xs text-neutral-500 font-mono break-all">
                  {selectedGarage.employee?.email || "N/A"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Acquisition Onboarding Phase
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`h-2 w-2 rounded-full block shrink-0 ${
                    selectedGarage.leadStatus === "CONVERTED" ? "bg-green-600" :
                    selectedGarage.leadStatus === "REJECTED" ? "bg-red-500" : "bg-blue-500"
                  }`} />
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {getStatusLabel(selectedGarage.leadStatus)}
                  </p>
                </div>
              </div>

            </div>

            {/* Feedback log block */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
                Qualitative On-Site Feedback Log
              </span>
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-3.5 sm:p-4 text-xs sm:text-sm text-neutral-700 leading-relaxed break-words">
                {selectedGarage.notes || "No system metadata documentation provided for this workstation log run."}
              </div>
            </div>

            {/* Media Image Grid Matrix */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                Visual Evidence Validation Frames ({selectedGarage.images?.length || 0})
              </span>
              
              {selectedGarage.images && selectedGarage.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedGarage.images.map((img) => (
                    <div 
                      key={img.id} 
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className="relative group aspect-video rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden cursor-pointer shadow-xs"
                    >
                      <img
                        src={img.imageUrl}
                        alt="Intake snapshot"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-mono text-neutral-400 border border-dashed border-neutral-200 p-6 rounded-lg text-center">
                  No layout imagery captured at site parameter bounds.
                </div>
              )}
            </div>

          </div>

          {/* Footer Bar Information */}
          <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 hidden sm:flex items-center justify-between text-[10px] font-mono text-neutral-400 shrink-0">
            <span>Index Entity Identification: {selectedGarage.id || "SYS-GEN"}</span>
            <span>Console Access Log Nominal</span>
          </div>

        </div>
      </div>

      <ImagePopup
        images={selectedGarage.images}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </>
  );
};

export default AdminGarageDetailsPopup;