import { CreateLinkForm } from "../components/features/links/CreateLinkForm";
import { LinkList } from "../components/features/links/LinkList";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 md:px-20">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1">
            <img
              src="/logo.png"
              alt="brev.ly"
              className="h-8 w-8"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            {/* Fallback if no logo image */}
            <div className="h-6 w-6 border-2 border-white rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">brev.ly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Create Link */}
          <CreateLinkForm />

          {/* Right Column: My Links */}
          <LinkList />
        </div>
      </div>
    </div>
  );
}
