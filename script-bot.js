"use strict";

// =====================================
// DOMAIN VALIDATION & CONFIGURATION
// =====================================
const ChatBotConfig = {
 allowedDomains: ["*"] ,

  responses: [
    "That's fascinating! Tell me more.",
    "I understand. How can I help further?",
    "Great question! Let me process that...",
    "I'm here to assist you!",
    "Thanks for sharing that with me.",
    "What else would you like to know?",
    "Processing your request...",
    "That's important. What's next?",
    "I appreciate you reaching out!",
    "Interesting! What are your thoughts?",
  ]
};

// =====================================
// CHAT BOT STATE MANAGEMENT
// =====================================
const ChatBotState = {
  isActive: false,
  isOpen: false,
  micActive: false,
  cameraActive: false,
  audioStream: null,
  videoStream: null,
  audioContext: null,
  analyser: null,
  animationId: null,
  
  // State updaters
  setActive: (value) => { ChatBotState.isActive = value; },
  setOpen: (value) => { ChatBotState.isOpen = value; },
  setMicActive: (value) => { ChatBotState.micActive = value; },
  setCameraActive: (value) => { ChatBotState.cameraActive = value; },
  setAudioStream: (stream) => { ChatBotState.audioStream = stream; },
  setVideoStream: (stream) => { ChatBotState.videoStream = stream; },
  setAudioContext: (context) => { ChatBotState.audioContext = context; },
  setAnalyser: (analyser) => { ChatBotState.analyser = analyser; },
  setAnimationId: (id) => { ChatBotState.animationId = id; }
};

// =====================================
// TOGGLE BUTTON COMPONENT
// =====================================
const ToggleButton = {
  styles: {
    base: "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #2196f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; color: white; cursor: pointer; box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3); z-index: 1000000; transition: background 0.3s ease, box-shadow 0.3s ease; user-select: none;",
    hover: "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #1e88e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; color: white; cursor: pointer; box-shadow: 0 4px 22px rgba(33, 150, 243, 0.5); z-index: 1000000; transition: background 0.3s ease, box-shadow 0.3s ease; user-select: none;",
    // open: "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, #2196f3 0%, #1e88e5 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; cursor: pointer; box-shadow: 0 4px 20px rgba(33, 150, 243, 0.4); z-index: 1000000; transition: all 0.3s ease; user-select: none;",
    // close: "position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #ff5252; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; cursor: pointer; box-shadow: 0 4px 20px rgba(255, 82, 82, 0.4); z-index: 1000000; transition: all 0.3s ease; user-select: none;"
  },

  create() {
    const toggleBtn = document.createElement("div");
    toggleBtn.className = "chat-toggle-btn";
    toggleBtn.innerHTML = "🗨️";
    toggleBtn.setAttribute("style", this.styles.base);
    console.log(this)
    this.addEventListeners(toggleBtn);
    document.body.appendChild(toggleBtn);
    
    return toggleBtn;
  },

  addEventListeners(element) {
    element.addEventListener("click", ChatBotUI.toggle);
    
    element.addEventListener("mouseenter", () => {
      element.setAttribute("style", this.styles.hover);
    });
    
    element.addEventListener("mouseleave", () => {
      element.setAttribute("style", this.styles.base);
    });
  }
};

// =====================================
// CHAT HEADER COMPONENT
// =====================================
const ChatHeader = {
  template: `
    <div class="chat-header" style="grid-area: header; background: #0000FF; color: white; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; cursor: move; user-select: none; box-shadow: 0 2px 12px rgba(102, 126, 234, 0.15); position: relative; overflow: hidden;">
      <div class="header-glow" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%); pointer-events: none;"></div>
      <div class="header-info" style="display: flex; align-items: center; gap: 12px; position: relative; z-index: 1;">
        <div class="status-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);"></div>
        <h3 class="bot-title" style="font-size: 15px; font-weight: 700; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.1); letter-spacing: 0.3px;">🤖 AI Assistant</h3>
      </div>
      <div class="header-actions" style="position: relative; z-index: 1;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); margin: 0 2px; display: inline-block;"></div>
        <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); margin: 0 2px; display: inline-block;"></div>
        <div style="width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); margin: 0 2px; display: inline-block;"></div>
      </div>
    </div>
  `
};

// =====================================
// CHAT AREA COMPONENT
// =====================================
const ChatArea = {
  template: `
    <div class="chat-area" style="grid-area: chat; display: flex; flex-direction: column; overflow: hidden; position: relative;">
      <div class="chat-background" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.03; pointer-events: none;"></div>
      <div class="messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; max-height: 100vh; position: relative; z-index: 1; scrollbar-width: thin; scrollbar-color: #cbd5e0 transparent;">
        <div class="message bot-msg" style="max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 13px; line-height: 1.5; animation: messageSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); color: #2d3748; align-self: flex-start; border-bottom-left-radius: 6px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06); position: relative; backdrop-filter: blur(10px);">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px;"></div>
          👋 Hello! I'm your AI assistant. How can I help you today?
        </div>
      </div>
    </div>
  `
};

// =====================================
// INPUT AREA COMPONENT
// =====================================
const InputArea = {
  template: `
    <div class="input-area" style="grid-area: input; padding: 16px 20px; border-top: 1px solid #e2e8f0; background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%); backdrop-filter: blur(10px);">
      <div class="input-group" style="display: flex; gap: 12px; align-items: center; position: relative;">
        <div style="flex: 1; position: relative;">
          <input class="message-input" placeholder="Type your message..." style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 20px; font-size: 13px; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); box-shadow: 0 1px 3px rgba(0,0,0,0.05); font-family: inherit;" />
          <div class="input-glow" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 20px; opacity: 0; transition: opacity 0.3s; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); pointer-events: none;"></div>
        </div>
        <button class="send-button" style="padding: 12px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%); transition: left 0.5s; pointer-events: none;"></div>
          <span style="position: relative; z-index: 1;">Send</span>
        </button>
      </div>
    </div>
  `
};

// =====================================
// MEDIA PANEL COMPONENT
// =====================================
const MediaPanel = {
  template: `
    <div class="media-panel" style="grid-area: media; background: linear-gradient(180deg, #fafbfc 0%, #f4f6f8 100%); border-top: 1px solid #e2e8f0; padding: 16px; display: flex; gap: 16px; position: relative;">
      <div class="panel-glow" style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%);"></div>
      
      <div class="video-preview" onclick="document.querySelector('.cam-btn').click()" style="width: 120px; height: 44px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 10px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1); cursor: pointer; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #404040;">
        <video class="webcam" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: cover; display: none; border-radius: 11px;"></video>
        <div class="video-off" style="color: #9ca3af; font-size: 10px; text-align: center; cursor: pointer; transition: color 0.3s;">
          <div style="font-size: 16px; margin-bottom: 2px;">📷</div>
          <small style="font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Camera</small>
        </div>
      </div>

      <div class="audio-viz" style="flex: 1; height: 44px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; position: relative; box-shadow: 0 3px 10px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1); border: 1px solid #404040; overflow: hidden;">
        <canvas class="viz-canvas" style="width: 100%; height: 100%; border-radius: 11px;"></canvas>
        <div class="viz-off" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #9ca3af; font-size: 10px; text-align: center; transition: color 0.3s;">
          <div style="font-size: 16px; margin-bottom: 2px;">🎤</div>
          <small style="font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Audio</small>
        </div>
      </div>

      <div class="media-controls" style="display: flex; flex-direction: column; gap: 8px; margin-top: 0;">
        <button class="control-btn mic-btn" style="padding: 8px 12px; border: 2px solid #e2e8f0; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 10px; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); text-transform: uppercase; letter-spacing: 0.3px; min-width: 60px; backdrop-filter: blur(10px);">
          <span style="font-size: 12px;">🎤</span>
          <span>Mic</span>
        </button>
        <button class="control-btn cam-btn" style="padding: 8px 12px; border: 2px solid #e2e8f0; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 10px; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); text-transform: uppercase; letter-spacing: 0.3px; min-width: 60px; backdrop-filter: blur(10px);">
          <span style="font-size: 12px;">📷</span>
          <span>Cam</span>
        </button>
      </div>
    </div>
  `
};

// =====================================
// STYLES COMPONENT
// =====================================
const ChatBotStyles = {
  css: `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }
    
    @keyframes messageSlide {
      0% { opacity: 0; transform: translateY(10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .message-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(0,0,0,0.08) !important;
    }
    
    .message-input:focus + .input-glow {
      opacity: 1 !important;
    }
    
    .send-button:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }
    
    .send-button:hover div {
      left: 100% !important;
    }
    
    .send-button:active {
      transform: translateY(0) !important;
    }
    
    .control-btn:hover {
      border-color: #667eea !important;
      background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15) !important;
    }
    
    .video-preview:hover {
      transform: scale(1.02) !important;
    }
    
    .video-preview:hover .video-off {
      color: #667eea !important;
    }
    
    .viz-off:hover {
      color: #667eea !important;
    }
    
    .messages::-webkit-scrollbar {
      width: 4px;
    }
    
    .messages::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .messages::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%);
      border-radius: 4px;
    }
    
    .messages::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #a0aec0 0%, #718096 100%);
    }
  `
};

// =====================================
// MAIN CHAT BOT UI COMPONENT
// =====================================
const ChatBotUI = {
  containerStyle: 'position: fixed; bottom: 100px; right: 20px; width: 400px; height: 600px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); z-index: 999999; display: none; grid-template: "header" auto "chat" 1fr "media" auto "input" auto / 1fr; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; border: 1px solid rgba(255, 255, 255, 0.2);',

  create() {
    const bot = document.createElement("div");
    bot.className = "ai-chat-bot";
    bot.innerHTML = `
      ${ChatHeader.template}
      ${ChatArea.template}
      ${InputArea.template}
      ${MediaPanel.template}
      <style>${ChatBotStyles.css}</style>
    `;
    
    bot.setAttribute("style", this.containerStyle);
    document.body.appendChild(bot);
    
    ChatBotEventHandlers.setup(bot);
    return bot;
  },

  toggle() {
    const chatBot = document.querySelector(".ai-chat-bot");
    const toggleBtn = document.querySelector(".chat-toggle-btn");

    if (ChatBotState.isOpen) {
      chatBot.style.display = "none";
      toggleBtn.innerHTML = "💬";
      toggleBtn.setAttribute("style", ToggleButton.styles.open);
    } else {
      chatBot.style.display = "grid";
      toggleBtn.innerHTML = "✕";
      toggleBtn.setAttribute("style", ToggleButton.styles.close);
    }
    ChatBotState.setOpen(!ChatBotState.isOpen);
  }
};

// =====================================
// MESSAGE HANDLER COMPONENT
// =====================================
const MessageHandler = {
  add(text, isUser = false) {
    const messages = document.querySelector(".messages");
    const msg = document.createElement("div");
    msg.className = "message " + (isUser ? "user-msg" : "bot-msg");
    msg.textContent = text;

    const userStyle = "max-width: 85%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4; animation: messageSlide 0.3s ease-out; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; align-self: flex-end; border-bottom-right-radius: 4px;";
    const botStyle = "max-width: 85%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4; animation: messageSlide 0.3s ease-out; background: #f8f9fa; color: #2d3748; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0;";

    msg.setAttribute("style", isUser ? userStyle : botStyle);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  },

  send() {
    const input = document.querySelector(".message-input");
    const text = input.value.trim();
    if (!text) return;

    this.add(text, true);
    input.value = "";

    setTimeout(() => {
      const response = ChatBotConfig.responses[Math.floor(Math.random() * ChatBotConfig.responses.length)];
      this.add(response);
    }, 500 + Math.random() * 1000);
  }
};

// =====================================
// MEDIA CONTROLS COMPONENT
// =====================================
const MediaControls = {
  async toggleMic() {
    const micBtn = document.querySelector(".mic-btn");
    const canvas = document.querySelector(".viz-canvas");
    const vizOff = document.querySelector(".viz-off");

    if (!ChatBotState.micActive) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true }
        });

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(audioStream);

        analyser.fftSize = 256;
        source.connect(analyser);

        ChatBotState.setAudioStream(audioStream);
        ChatBotState.setAudioContext(audioContext);
        ChatBotState.setAnalyser(analyser);
        ChatBotState.setMicActive(true);

        micBtn.classList.add("active");
        micBtn.setAttribute("style", "flex: 1; padding: 6px 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-color: #667eea; border-radius: 6px; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 4px; border: 1px solid #667eea;");

        AudioVisualizer.start();
      } catch (error) {
        console.error("Microphone error:", error);
      }
    } else {
      if (ChatBotState.audioStream) {
        ChatBotState.audioStream.getTracks().forEach(t => t.stop());
      }
      if (ChatBotState.audioContext) ChatBotState.audioContext.close();
      if (ChatBotState.animationId) cancelAnimationFrame(ChatBotState.animationId);

      ChatBotState.setMicActive(false);
      micBtn.classList.remove("active");
      micBtn.setAttribute("style", "flex: 1; padding: 6px 8px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 4px;");

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      vizOff.style.display = "block";
    }
  },

  async toggleCam() {
    const camBtn = document.querySelector(".cam-btn");
    const webcam = document.querySelector(".webcam");
    const videoOff = document.querySelector(".video-off");

    if (!ChatBotState.cameraActive) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" }
        });

        webcam.srcObject = videoStream;
        webcam.style.display = "block";
        videoOff.style.display = "none";

        ChatBotState.setVideoStream(videoStream);
        ChatBotState.setCameraActive(true);

        camBtn.classList.add("active");
        camBtn.setAttribute("style", "flex: 1; padding: 6px 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-color: #667eea; border-radius: 6px; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 4px; border: 1px solid #667eea;");
      } catch (error) {
        console.error("Camera error:", error);
      }
    } else {
      if (ChatBotState.videoStream) {
        ChatBotState.videoStream.getTracks().forEach(t => t.stop());
      }

      webcam.style.display = "none";
      videoOff.style.display = "block";
      webcam.srcObject = null;

      ChatBotState.setCameraActive(false);
      camBtn.classList.remove("active");
      camBtn.setAttribute("style", "flex: 1; padding: 6px 8px; border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 10px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 4px;");
    }
  }
};

// =====================================
// AUDIO VISUALIZER COMPONENT
// =====================================
const AudioVisualizer = {
  start() {
    const canvas = document.querySelector(".viz-canvas");
    const vizOff = document.querySelector(".viz-off");
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    vizOff.style.display = "none";

    const draw = () => {
      if (!ChatBotState.micActive || !ChatBotState.analyser) return;

      const bufferLength = ChatBotState.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      ChatBotState.analyser.getByteFrequencyData(dataArray);

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      ChatBotState.setAnimationId(requestAnimationFrame(draw));
    };
    draw();
  }
};

// =====================================
// DRAG HANDLER COMPONENT
// =====================================
const DragHandler = {
  isDragging: false,
  dragOffset: { x: 0, y: 0 },

  setup(bot) {
    const header = bot.querySelector(".chat-header");

    header.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      const rect = bot.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
    });


      document.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      bot.style.left = "auto";
      bot.style.right = 
        window.innerWidth - e.clientX + this.dragOffset.x - bot.offsetWidth + "px";
      bot.style.bottom = 
        window.innerHeight - e.clientY + this.dragOffset.y - bot.offsetHeight + "px";
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
    });
  }
};

// =====================================
// EVENT HANDLERS COMPONENT
// =====================================
const ChatBotEventHandlers = {
  setup(bot) {
    const input = bot.querySelector(".message-input");
    const sendBtn = bot.querySelector(".send-button");
    const micBtn = bot.querySelector(".mic-btn");
    const camBtn = bot.querySelector(".cam-btn");

    // Message handling
    sendBtn.addEventListener("click", () => MessageHandler.send());
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") MessageHandler.send();
    });

    // Media controls
    micBtn.addEventListener("click", () => MediaControls.toggleMic());
    camBtn.addEventListener("click", () => MediaControls.toggleCam());

    // Drag functionality
    DragHandler.setup(bot);

    // Focus input by default
    input.focus();
  }
};

// =====================================
// INITIALIZATION
// =====================================
const ChatBot = {
  init() {
    if (!ChatBotConfig.allowedDomains.includes(location.hostname)) {
      console.warn("[CHAT BOT] Access denied for:", location.hostname);
      return;
    }

    if (ChatBotState.isActive) return;

    ToggleButton.create();
    ChatBotUI.create();
    ChatBotState.setActive(true);
    console.log("[CHAT BOT] Initialized on:", location.hostname);
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ChatBot.init);
} else {
  ChatBot.init();
}
