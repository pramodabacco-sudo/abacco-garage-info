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
      {/* Dimmed Modal Mask Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        
        {/* Backdrop dismiss anchor area target */}
        <div className="absolute inset-0" onClick={() => setSelectedGarage(null)} />

        {/* Primary Content Card Sheet */}
        <div className="bg-white w-full max-w-4xl h-screen sm:h-auto sm:max-h-[90vh] border-0 sm:border border-[#D9D9D9] shadow-[0_24px_70px_rgba(0,0,0,0.08)] relative z-10 font-sans antialiased flex flex-col overflow-visible">

        <button
        onClick={() => setSelectedGarage(null)}
        className="
            absolute
            top-13 right-3
            sm:top-4 sm:right-4
            md:top-5 md:right-5
            z-[99999]
            flex items-center justify-center
            w-10 h-10 sm:w-11 sm:h-11
            rounded-full
            bg-black/90
            text-white
            shadow-xl
            hover:bg-black
            active:scale-95
            transition-all
            duration-200
            text-lg sm:text-xl
            leading-none
        "
        aria-label="Close popup"
        >
        ✕
        </button>

          {/* FIX: Added 'pt-20 sm:pt-10' spacing profile.
            'pt-20' provides a protective margin clear of the 16-unit high mobile system top-bar layout header.
          */}
          <div className="px-6 pb-24 pt-20 sm:p-10 overflow-y-auto flex-1 space-y-8">
            
            {/* Header Block with custom text line wrapping constraints */}
            <div className="pb-5 border-b border-neutral-200 pr-8">
              <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-bold block mb-1.5">
                — DISPATCH DOSSIER DATA —
              </span>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-900 font-serif break-words leading-snug">
                {selectedGarage.shopName}
              </h1>
            </div>

            {/* Grid Layout Metric Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 pb-6 border-b border-neutral-100">
              
              <div className="break-words">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Primary Location Address
                </span>
                <p className="text-sm text-neutral-800 font-medium leading-relaxed">
                  {selectedGarage.address}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Contact Line Connection
                </span>
                <p className="text-sm text-neutral-800 font-mono tracking-wide">
                  {selectedGarage.phoneNumber}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Territory Operations Region
                </span>
                <p className="text-sm text-neutral-800 font-medium">
                  {selectedGarage.location || "Unassigned Sector"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Field Representative Agent
                </span>
                <p className="text-sm text-neutral-900 font-bold">
                  {selectedGarage.employee?.name || "System Base"}
                </p>
              </div>

              <div className="overflow-hidden text-ellipsis">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Agent Authentication Key
                </span>
                <p className="text-sm text-neutral-500 font-mono text-xs break-all">
                  {selectedGarage.employee?.email || "N/A"}
                </p>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                  Acquisition Onboarding Phase
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full block shrink-0 ${
                    selectedGarage.leadStatus === "CONVERTED" ? "bg-neutral-900" :
                    selectedGarage.leadStatus === "REJECTED" ? "bg-neutral-200" : "bg-neutral-400"
                  }`} />
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {getStatusLabel(selectedGarage.leadStatus)}
                  </p>
                </div>
              </div>

            </div>

            {/* Qualitative Notes Logs Block */}
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
                Qualitative On-Site Feedback Log
              </span>
              <div className="bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700 leading-relaxed font-sans break-words">
                {selectedGarage.notes || "No system metadata documentation provided for this workstation log run."}
              </div>
            </div>

            {/* Visual Grid Media Matrix Display */}
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
                      className="relative group aspect-video border border-neutral-200 bg-neutral-50 overflow-hidden cursor-pointer shadow-2xs"
                    >
                      <img
                        src={img.imageUrl}
                        alt="Intake snapshot"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-mono text-neutral-400 border border-dashed border-neutral-200 p-6 text-center">
                  No layout imagery captured at site parameter bounds.
                </div>
              )}
            </div>

          </div>

          {/* Persistent Footer Log strip data */}
          <div className="px-10 py-3 bg-neutral-50 border-t border-neutral-100 hidden sm:flex items-center justify-between text-[10px] font-mono text-neutral-400">
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