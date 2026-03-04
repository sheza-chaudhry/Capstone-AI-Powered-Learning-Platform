import ChatWindow from 'page' 

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F5E6D3] p-8">
      <div className="w-full max-w-5xl h-[90vh] border-4 border-black bg-[#E8F4F8] rounded-lg flex flex-col">
        {/* Header with buttons */}
        <div className="flex justify-between items-center p-6">
          <button className="px-8 py-3 bg-[#A8D5E2] text-black font-semibold 
          rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
          hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer transition-all">
            Back to chatbot
          </button>
        </div>

        <div className="border-t-4 border-black justfisy-center items-center p-6">
            <h1 className="text-2xl font-bold text-center py-4">Frequently Asked Questions</h1>
            <
        </div>

        {/* Chat area */}
        <div className="flex-1 px-6 pb-6 min-h-0">
          <ChatWindow />
        </div>
      </div>
    </main>
  )
}