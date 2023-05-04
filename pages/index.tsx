import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useRef, useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";
import useSWR from "swr";
import { signOut } from "next-auth/react";

import { IModalContext, ModalContext } from "../context/ModalContext";
import trelloFetcher from "../utils/fetchers/Trello";

import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import WelcomeScreen from "../components/WelcomeScreen";

const Home: NextPage = () => {
  const { modalContext, setModalContext } = useContext(
    ModalContext
  ) as IModalContext;
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [generatedBios, setGeneratedBios] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [boards, setBoards] = useState([]);
  const [organizationId, setOrganizationId] = useState("");

  const router = useRouter();

  const handleLogout = () => {
    setModalContext({ ...modalContext, welcome: true });
    signOut({ redirect: false });
  };

  const {
    data,
    error: fetchBoardsError,
    isLoading,
  } = useSWR(
    Cookies.get("auth-token")
      ? `/api/trello/boards?organizationId=${organizationId}`
      : null,
    trelloFetcher
  );
  if (fetchBoardsError)
    toast.error(`Error fetching boards: ${fetchBoardsError}`);

  // const fetchBoards = async (organizationId?: string) => {

  //     const response = await fetch(`/api/trello/boards?organizationId=${organizationId}`, {
  //       headers: {
  //         Authorization: `Bearer ${Cookies.get("auth-token")}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch boards");
  //     }

  //     const data: boards  = await response.json();
  //     setBoards(data.result); // Access the 'result' key here
  //     console.log(data.result); // Log the 'result' key as well
  //   } catch (error) {
  //     toast.error(`Error fetching boards: ${error}`);
  //   }
  // };

  // if (typeof window !== "undefined") {
  //   const authToken = router.asPath.split("=")[1];
  //   if (authToken) {
  //     Cookies.set("auth-token", authToken, );
  //   }
  // }

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const submitQuestion = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedBios("");

    try {
      if (question === "") {
        throw new Error("Question cannot be empty");
      }

      if (!Cookies.get("auth-token")) {
        throw new Error("Not authenticated");
      }

      const preProcessedData = await fetch(
        `/api/trello/board/${selectedBoardId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth-token")}`,
          },
        }
      );

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_question: question,
          preprocessed_data: await preProcessedData.json(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate answer");
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedBios((prev) => prev + chunkValue);
      }
    } catch (error) {
      toast.error(`Error generating answer: ${error}`);
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

      {modalContext.welcome && (
        <WelcomeScreen
          setShowWelcome={() =>
            setModalContext({ ...modalContext, welcome: !modalContext.welcome })
          }
          setSelectedBoardId={setSelectedBoardId}
        />
      )}

      <Header handleLogout={handleLogout} setOrganizationId={setOrganizationId} />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Talk to your Trello Board
        </h1>
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          className="w-full mt-4 mb-8 bg-white border border-black rounded-md text-black font-medium px-4 py-2"
        >
          <option value="" disabled>
            Select a Trello board
          </option>
          {data?.result &&
            data.result.map((board: { id: any; name: string }) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
        </select>
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
              onClick={() =>
                setQuestion("What are all the lists on this board?")
              }
              className="bg-white border border-black rounded-xl text-black font-medium px-4 py-2 hover:bg-gray-200 w-full mb-2"
            >
              What are all the lists on this board?
            </button>
            <button
              onClick={() =>
                setQuestion("How many cards are in the To Do list?")
              }
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
              onClick={() =>
                setQuestion("Show me all the cards with the 'bug' label.")
              }
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
              <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border">
                <ReactMarkdown>{generatedBios}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
