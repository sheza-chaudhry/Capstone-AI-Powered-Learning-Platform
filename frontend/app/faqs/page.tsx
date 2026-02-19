import ChatWindow from '../page' 
import Link from "next/link";

export default function FAQs() {
  const faqs = [
    "Question 1: .....",
    "Question 2: .....",
    "Question 3: .....",
    "Question 4: .....",
  ];
  return (
    

      <div className=" flex items-center justify-center min-h-screen bg-[#F5E6D3] p-8 ">
      <div className=" w-full max-w-5xl h-[90vh] border-4 border-black bg-[#E8F4F8] rounded-lg flex flex-col">
        <div className="flex justify-between items-center p-6">
      < Link href = "/" className=" back-btn px-8 py-3 bg-[#A8D5E2] text-black font-semibold 
          rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] 
          hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer transition-all">Back</Link>
           </div>
           <h1 className= "flex flex-col items center gap-8 text-lg font-bold">Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
            <div key={index} className="faq-item p-6 flex flex-col items-center justify-center gap-3 w-12 h-12 rounded-full border-2 border-black bg-white
             flex items-center justify-center text-2xl hover:bg-gray-50 transition-colors">
              <p>{faq}</p>  
            </div>
        ))}
      </div>
      

    </div>

  )
}