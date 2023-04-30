import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [generatedBios, setGeneratedBios] = useState("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const submitQuestion = async (e: any) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Replace this with your API call or logic to generate the answer
      const preProcessedData = await fetch('/api/trello/board/644ea17c62d66c926139f10f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ATTAfebcadf0fc59c8b271089c4af32ec32a36b2f870bfaf2d007f6e6f060f8ac8ab58941A65' },
      });
      console.log(preProcessedData.json());

      const preprocessed_data = await preProcessedData.json();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_question:question, preprocessed_data: preprocessed_data }),
      });
  
  
      if (!response.ok) {
        throw new Error('Failed to generate answer');
      }
  
      const data = await response.json();
      setGeneratedBios(data.answer);
    } catch (error) {
      toast.error('Error generating answer');
    } finally {
      setLoading(false);
      scrollToBios();
    }
  };  

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Talk to Trello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Talk to your Trello Board
        </h1>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
              placeholder="Enter your question here"
            />
          </div>
          <div className="text-left font-medium mb-2">Presets:</div>
          <div className="mb-5">
            <button
              onClick={() => setQuestion("What are all the lists on this board?")}
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
              What are all the lists on this board?
            </button>
            <button
              onClick={() => setQuestion("How many cards are in the To Do list?")}
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
              How many cards are in the "To Do" list?
            </button>
            <button
              onClick={() => setQuestion("What is the status of the project?")}
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
             What is the status of the project?
            </button>
            <button
              onClick={() => setQuestion("Are there any overdue tasks?")}
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
             Are there any overdue tasks?
            </button>
            <button
              onClick={() => setQuestion("Show me all the cards with the 'bug' label.")}
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
             Show me all the cards with the 'bug' label.
            </button>
            {/* Add more preset question buttons as needed */}
          </div>
          {!loading && (
           <button
           className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
           onClick={(e) => submitQuestion(e)}
         >
           Submit Question &rarr;
         </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
      </main>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
      <div className="space-y-10 my-10">
        {generatedBios && (
          <>
            <div>
              <h2
                className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                ref={bioRef}
              >
                Answer:
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {generatedBios
                .substring(generatedBios.indexOf("1") + 3)
                .split("2.")
                .map((generatedBio) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBio);
                        toast("Bio copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                      key={generatedBio}
                    >
                      <p>{generatedBio}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
