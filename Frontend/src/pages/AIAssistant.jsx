import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../components/AxiosInspector';
// import mammoth from 'mammoth';
// import * as pdfjsLib from 'pdfjs-dist';


const AIAssistant = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.username || 'Developer'}! I'm your personal AI Career Coach. 💼
      
      I can help you with:
- Cover letter writing
- Interview preparation  
- Technical interview questions
- Salary negotiation strategies

What would you like help with today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const chatEndRef = useRef(null);
  // const fileInputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // resume uploader feature for future

  // pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

  // Helper: File to Base64
  // const fileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       const base64 = reader.result.toString().split(',')[1];
  //       resolve(base64);
  //     };
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // // Helper: PDF text extractor using pdf.js
  // const extractTextFromPDF = async (file) => {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  //   const pdf = await loadingTask.promise;
  //   let fullText = '';
  //   for (let i = 1; i <= pdf.numPages; i++) {
  //     const page = await pdf.getPage(i);
  //     const textContent = await page.getTextContent();
  //     const pageText = textContent.items.map((item) => item.str).join(' ');
  //     fullText += pageText + '\n';
  //   }
  //   return fullText;
  // };

  // // Helper: Word text extractor using mammoth.js
  // const extractTextFromWord = async (file) => {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const result = await mammoth.extractRawText({ arrayBuffer });
  //   return result.value;
  // };

  // Call backend AI endpoint

  const callBackendAI = async (messageText) => {
    const res = await axiosInstance.post(`/ai/response`, {
      message: messageText
    });
    if (res.data.success) {
      return res.data.reply;
    } else {
      throw new Error(res.data.message || "Backend AI response failed.");
    }
  };

  // Handle Text Chat Submission
  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (messageText.length > 1500) {
      setErrorMessage("Message too long. Please keep it under 1500 characters.");
      return;
    }

    if (!textToSend) setInput('');
    setErrorMessage('');

    const newMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reply = await callBackendAI(messageText);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message || 'AI error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // resume uploader feature for future

  // Handle File Upload & Review (Word/Text-based PDF -> backend Groq)
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setErrorMessage('');
  //   setUploadLoading(true);

  //   const fileType = file.name.split('.').pop().toLowerCase();
  //   const promptText = "Ye resume review karo aur detailed feedback do — strengths, weaknesses, aur improvements batao. Respond in Hinglish like an expert coach.";

  //   try {
  //     if (fileType === 'docx') {
  //       // Docx -> mammoth -> Backend AI (Groq)
  //       const text = await extractTextFromWord(file);
  //       if (!text.trim()) {
  //         throw new Error("Word file content empty lag raha hai!");
  //       }

  //       setMessages((prev) => [
  //         ...prev,
  //         { role: 'user', content: `[Uploaded Resume: ${file.name}]` }
  //       ]);

  //       setIsLoading(true);
  //       const reply = await callBackendAI(`${promptText}\n\nResume content:\n${text}`);
  //       setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

  //     } else if (fileType === 'pdf') {
  //       // PDF text-based
  //       let text = '';
  //       try {
  //         text = await extractTextFromPDF(file);
  //       } catch (pdfErr) {
  //         console.warn("PDF extraction text-mode error", pdfErr);
  //       }

  //       if (text && text.trim().length > 100) {
  //         setMessages((prev) => [
  //           ...prev,
  //           { role: 'user', content: `[Uploaded Resume: ${file.name}]` }
  //         ]);

  //         setIsLoading(true);
  //         // Text-based PDF -> Backend AI (Groq)
  //         const reply = await callBackendAI(`${promptText}\n\nResume content:\n${text}`);
  //         setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
  //       } else {
  //         setErrorMessage("Scanned / Image-based PDF files support nahi hain. Please ek text-based PDF ya DOCX upload karein.");
  //       }

  //     } else if (['jpg', 'jpeg', 'png'].includes(fileType)) {
  //       setErrorMessage("Image files (.jpg, .png) support nahi hain. Please ek text-based PDF ya DOCX resume upload karein.");
  //     } else {
  //       setErrorMessage("Unsupported format! Please upload .pdf or .docx only.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setErrorMessage(err.message || 'File parsing or AI error. Check your console.');
  //   } finally {
  //     setUploadLoading(false);
  //     setIsLoading(false);
  //     if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
  //   }
  // };

  const quickPrompts = [
    { label: 'Cover letter 📝', prompt: 'Stripe entry-level frontend developer job ke liye ek solid Hinglish cover letter bana do, short aur professional.' },
    { label: 'Interview prep 🎯', prompt: 'Mera kal React developer ka round hai. Common junior questions and tips do.' },
    { label: 'Resume tips 👤', prompt: 'Project section me visual hierarchy aur strong verbs kaise dalein?' },
    { label: 'Salary negotiate 💵', prompt: '6 LPA standard offer ko 8 LPA tak negotiate karne ke liye kya keywords bole HR se?' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] border border-card-border bg-card-bg rounded-2xl animate-slide-up shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-card-border bg-[#0d0d18]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] shadow-[0_0_10px_rgba(124,58,237,0.3)]">
            🤖
          </div>
          <div>
            <h2 className="font-sans text-sm font-bold text-white leading-none">
              AI Career Assistant
            </h2>
            <span className="font-mono text-[10px] text-emerald-400">
              llama-3.3-70b-versatile
            </span>
          </div>
        </div>

        {/* Upload Button */}
        {/* <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLoading || isLoading}
            className="btn-glow flex items-center gap-2 rounded-xl bg-white/5 border border-card-border px-3.5 py-2 font-sans text-xs font-semibold text-[#a78bfa] hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadLoading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border border-white border-t-transparent"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            <span>Upload Resume</span>
          </button>
        </div> */}
      </div>

      {/* Warning/Error Bar */}
      {errorMessage && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-5 py-2.5 text-xs text-red-400 font-sans text-center">
          {errorMessage}
        </div>
      )}

      {/* Messages Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, index) => {
          const isAI = msg.role === 'assistant';
          return (
            <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 font-sans text-sm shadow ${isAI
                  ? 'bg-black/30 border border-card-border text-[#e8e8f0]'
                  : 'bg-[#7c3aed] text-white shadow-[#7c3aed]/20'
                  }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-black/30 border border-card-border text-[#e8e8f0] flex items-center gap-1 py-4 px-5">
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-dot-pulse-1"></div>
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-dot-pulse-2"></div>
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-dot-pulse-3"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Suggesters */}
      <div className="px-5 py-2 border-t border-white/[0.03] overflow-x-auto flex gap-2 no-scrollbar bg-black/10">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            disabled={isLoading || uploadLoading}
            className="shrink-0 rounded-full border border-card-border bg-white/[0.02] px-3.5 py-1.5 font-sans text-xs text-[#9ca3af] hover:border-[#7c3aed] hover:text-white transition-all active:bg-[#7c3aed]/10"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 p-3 border-t border-card-border bg-[#0d0d18]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || uploadLoading}
          placeholder="Type your question here..."
          className="flex-1 rounded-xl border border-card-border bg-black/20 px-4 py-2.5 font-sans text-sm text-white placeholder-gray-500 transition-colors focus:border-[#7c3aed] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || uploadLoading}
          className="btn-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow shadow-[#7c3aed]/40 hover:scale-[1.02] disabled:scale-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
