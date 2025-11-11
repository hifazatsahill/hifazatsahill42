import { GoogleGenAI, Modality } from "@google/genai";

document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');

    // --- Mobile Navigation ---
    const mobileNav = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');

    if (mobileNav && navToggle) {
        // --- Close mobile menu on link click ---
        const navLinks = document.querySelectorAll('.nav-link, .nav-logo, .btn[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            });
        });
        
        // --- Mobile Navigation Toggle ---
        navToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    // --- Scroll Handler for Sticky Header and Active Link Highlighting ---
    const sections = document.querySelectorAll('.page[id]');
    const navHeaderLinks = document.querySelectorAll('.nav-links a.nav-link');

    const handleScroll = () => {
        if (!header) return;

        // Add scrolled class to header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight active nav link
        let currentSectionId = '';
        const headerOffset = header.offsetHeight + 1;

        sections.forEach(section => {
            const sectionEl = section as HTMLElement;
            if (sectionEl.offsetTop <= window.scrollY + headerOffset) {
                currentSectionId = sectionEl.id;
            }
        });
        
        navHeaderLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on load to set initial state

    // --- Animate on Scroll ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            question.classList.toggle('active');
            if (answer instanceof HTMLElement) {
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });

    // --- Form Submission Handling ---
    function handleFormSubmit(formId, message) {
        const form = document.getElementById(formId);
        if (form instanceof HTMLFormElement) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert(message);
                form.reset();
            });
        }
    }
    handleFormSubmit('contact-form', 'Thank you for your message! We will get back to you shortly.');
    handleFormSubmit('help-form', 'Thank you for your query! Our support team will respond soon.');


    // --- Animated Footer Ad ---
    const footerAd = document.getElementById('footer-ad');
    if (footerAd) {
        const ads = [
            "Special offer: 20% off on all services!",
            "Sign up for our newsletter for exclusive deals.",
            "Follow us on social media for the latest updates!",
            "Need a custom solution? Contact us today!"
        ];
        let adIndex = 0;
        setInterval(() => {
            adIndex = (adIndex + 1) % ads.length;
            footerAd.style.opacity = '0';
            setTimeout(() => {
                footerAd.textContent = ads[adIndex];
                footerAd.style.opacity = '1';
            }, 500);
        }, 4000); // Change ad every 4 seconds
    }

    // --- Projects Page Filter & Search (Multi-select enabled) ---
    const filterContainer = document.querySelector<HTMLElement>('.filter-buttons');
    if (filterContainer) {
        const filterButtons = Array.from(filterContainer.querySelectorAll<HTMLButtonElement>('.filter-btn'));
        const projectCards = document.querySelectorAll<HTMLElement>('.project-card');
        const filterStatus = document.getElementById('filter-status');
        const searchInput = document.getElementById('project-search') as HTMLInputElement;

        const filterProjects = () => {
            const activeFilterButtons = Array.from(filterContainer.querySelectorAll<HTMLButtonElement>('.filter-btn.active'));
            const activeTags = new Set(activeFilterButtons.map(btn => btn.dataset.tag));
            const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
            let visibleCount = 0;

            projectCards.forEach(card => {
                const projectTags = (card.dataset.tags || '').split(' ');
                const cardTextContent = card.textContent?.toLowerCase() || '';

                const tagMatch = activeTags.has('all') || projectTags.some(tag => activeTags.has(tag));
                const searchMatch = cardTextContent.includes(searchQuery);

                const shouldShow = tagMatch && searchMatch;
                card.style.display = shouldShow ? '' : 'none';
                if (shouldShow) visibleCount++;
            });

            if (filterStatus) {
                let tagText = 'all projects';
                if (!activeTags.has('all') && activeTags.size > 0) {
                    tagText = `projects tagged with ${[...activeTags].join(', ')}`;
                }
                const searchText = searchQuery ? ` matching "${searchQuery}"` : '';
                filterStatus.textContent = `Showing ${visibleCount} ${tagText}${searchText}.`;
            }
        };

        if (searchInput) {
            searchInput.addEventListener('input', filterProjects);
        }

        filterContainer.addEventListener('click', (e) => {
            const clickedButton = (e.target as HTMLElement).closest<HTMLButtonElement>('.filter-btn');
            if (!clickedButton) return;
            
            const isAllButton = clickedButton.dataset.tag === 'all';

            if (isAllButton) {
                if (!clickedButton.classList.contains('active')) {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    clickedButton.classList.add('active');
                }
            } else {
                filterButtons.find(btn => btn.dataset.tag === 'all')?.classList.remove('active');
                clickedButton.classList.toggle('active');
            }
            
            const anyActive = filterContainer.querySelector('.filter-btn.active:not([data-tag="all"])');
            if (!anyActive) {
                 filterButtons.find(btn => btn.dataset.tag === 'all')?.classList.add('active');
            }
            
            filterButtons.forEach(btn => btn.setAttribute('aria-selected', String(btn.classList.contains('active'))));
            filterProjects();
        });
    }

    // --- Testimonial Slider ---
    const testimonialContainer = document.querySelector('.testimonial-slider-container');
    if (testimonialContainer) {
        const slides = testimonialContainer.querySelectorAll<HTMLElement>('.testimonial-slide');
        const prevBtn = testimonialContainer.querySelector<HTMLButtonElement>('.prev-btn');
        const nextBtn = testimonialContainer.querySelector<HTMLButtonElement>('.next-btn');
        const dotsContainer = testimonialContainer.querySelector<HTMLElement>('.slider-dots');
        let currentSlide = 0;
        let slideInterval: number = 0;

        const showSlide = (index: number) => {
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
            if (dotsContainer) {
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].classList.toggle('active', i === currentSlide);
                }
            }
        };
        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);
        const startSlideShow = () => {
            slideInterval = window.setInterval(nextSlide, 7000);
        };
        const resetInterval = () => {
            clearInterval(slideInterval);
            startSlideShow();
        };

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }
        
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
        
        showSlide(0);
        startSlideShow();
    }
    
    // --- Live Chat Widget (Now AI Assistant) ---
    const chatWidgetContainer = document.getElementById('chat-widget-container');
    if (chatWidgetContainer) {
        const chatToggleBtn = document.getElementById('chat-toggle-btn');
        const chatWindow = document.getElementById('chat-window');
        const chatCloseBtn = document.getElementById('chat-close-btn');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input') as HTMLInputElement | null;
        const chatMessages = document.getElementById('chat-messages');
        
        if (chatToggleBtn && chatWindow && chatCloseBtn && chatForm && chatInput && chatMessages) {
            const openIcon = chatToggleBtn.querySelector('.chat-icon-open') as HTMLElement | null;
            const closeIcon = chatToggleBtn.querySelector('.chat-icon-close') as HTMLElement | null;

            if (openIcon && closeIcon) {
                const toggleChatWindow = () => {
                    const isActive = chatWindow.classList.toggle('active');
                    chatWindow.hidden = !isActive;
                    chatToggleBtn.setAttribute('aria-expanded', String(isActive));
                    openIcon.style.display = isActive ? 'none' : 'block';
                    closeIcon.style.display = isActive ? 'block' : 'none';
                    if (isActive) chatInput.focus();
                };

                chatToggleBtn.addEventListener('click', toggleChatWindow);
                chatCloseBtn.addEventListener('click', toggleChatWindow);

                const addMessage = (message: string, sender: 'user' | 'bot', isTyping: boolean = false) => {
                    const messageWrapper = document.createElement('div');
                    messageWrapper.classList.add('chat-message', sender);
                     if (isTyping) {
                        messageWrapper.classList.add('typing');
                        messageWrapper.id = 'typing-indicator';
                    }
                    const messageBubble = document.createElement('p');
                    messageBubble.textContent = message;
                    messageWrapper.appendChild(messageBubble);
                    chatMessages.appendChild(messageWrapper);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                };
                
                chatForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const userMessage = chatInput.value.trim();
                    if (!userMessage) return;

                    addMessage(userMessage, 'user');
                    chatInput.value = '';
                    chatInput.disabled = true;

                    addMessage("AI is thinking...", 'bot', true);

                    try {
                        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                        const response = await ai.models.generateContent({
                            model: 'gemini-2.5-flash',
                            contents: userMessage,
                        });
                        const botResponse = response.text;
                        
                        const typingIndicator = document.getElementById('typing-indicator');
                        if(typingIndicator) typingIndicator.remove();
                        
                        addMessage(botResponse, 'bot');
                        
                    } catch(error) {
                        const typingIndicator = document.getElementById('typing-indicator');
                        if(typingIndicator) typingIndicator.remove();
                        addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
                    } finally {
                        chatInput.disabled = false;
                        chatInput.focus();
                    }
                });
            }
        }
    }
    
    // --- AI CREATIVE STUDIO ---
    
    // --- Helper function to convert file to base64 ---
    const fileToGenerativePart = async (file: File): Promise<{mimeType: string, data: string}> => {
      const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      return {
        mimeType: file.type,
        data: await base64EncodedDataPromise,
      };
    };

    // --- Image Generator Logic (Imagen) ---
    const imageGeneratorForm = document.getElementById('image-generator-form') as HTMLFormElement;
    if (imageGeneratorForm) {
        const promptInput = document.getElementById('image-gen-prompt') as HTMLInputElement;
        const preview = document.getElementById('image-gen-preview');
        const generateBtn = document.getElementById('image-generator-btn') as HTMLButtonElement;
        const loader = document.getElementById('image-generator-loader');
        const loaderMessage = document.getElementById('image-generator-loader-message');
        
        imageGeneratorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Please enter a prompt to generate an image.');
                return;
            }

            generateBtn.disabled = true;
            loader.style.display = 'block';
            loaderMessage.textContent = 'Warming up the AI\'s paintbrush...';
            preview.innerHTML = '';

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const aspectRatio = (imageGeneratorForm.querySelector('input[name="image-aspect-ratio"]:checked') as HTMLInputElement).value;

                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
                    },
                });

                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                preview.innerHTML = `<img src="${imageUrl}" alt="Generated image for prompt: ${prompt}">`;

            } catch (error) {
                console.error('Image generation error:', error);
                preview.innerHTML = `<span class="preview-placeholder">Error: ${error.message}</span>`;
            } finally {
                generateBtn.disabled = false;
                loader.style.display = 'none';
            }
        });
    }


    // --- Image Editor Logic ---
    const imageEditorForm = document.getElementById('image-editor-form') as HTMLFormElement;
    if (imageEditorForm) {
        const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
        const imagePrompt = document.getElementById('image-prompt') as HTMLInputElement;
        const beforePreview = document.getElementById('image-editor-before-preview');
        const afterPreview = document.getElementById('image-editor-after-preview');
        const generateBtn = document.getElementById('image-editor-btn') as HTMLButtonElement;
        const loader = document.getElementById('image-editor-loader');
        const loaderMessage = document.getElementById('image-editor-loader-message');
        let imageFile: File | null = null;

        imageUpload.addEventListener('change', () => {
            if (imageUpload.files && imageUpload.files[0]) {
                imageFile = imageUpload.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    beforePreview.innerHTML = `<img src="${e.target.result}" alt="Original image preview">`;
                };
                reader.readAsDataURL(imageFile);
            }
        });

        imageEditorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!imageFile || !imagePrompt.value) {
                alert('Please upload an image and provide an edit instruction.');
                return;
            }
            
            generateBtn.disabled = true;
            loader.style.display = 'block';
            loaderMessage.textContent = 'Applying AI magic to your image...';
            afterPreview.innerHTML = '';

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const imagePart = { inlineData: await fileToGenerativePart(imageFile) };
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [imagePart, { text: imagePrompt.value }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                const firstPart = response.candidates?.[0]?.content?.parts?.[0];
                if (firstPart?.inlineData) {
                    const base64Image = firstPart.inlineData.data;
                    afterPreview.innerHTML = `<img src="data:${firstPart.inlineData.mimeType};base64,${base64Image}" alt="Edited image result">`;
                } else {
                    throw new Error('No image was generated. Please try a different prompt.');
                }
            } catch (error) {
                console.error('Image generation error:', error);
                afterPreview.innerHTML = `<span class="preview-placeholder">Error: ${error.message}</span>`;
            } finally {
                generateBtn.disabled = false;
                loader.style.display = 'none';
            }
        });
    }

    // --- Video Generator Logic ---
    const videoGeneratorForm = document.getElementById('video-generator-form') as HTMLFormElement;
    if (videoGeneratorForm) {
        let veoApiKeySelected = false;
        const keyPromptUI = document.getElementById('veo-api-key-prompt');
        const generatorUI = document.getElementById('video-generator-ui');
        const selectKeyBtn = document.getElementById('veo-select-key-btn');
        
        const videoUpload = document.getElementById('video-upload') as HTMLInputElement;
        const videoPrompt = document.getElementById('video-prompt') as HTMLInputElement;
        const preview = document.getElementById('video-gen-preview');
        const generateBtn = document.getElementById('video-generator-btn') as HTMLButtonElement;
        const loader = document.getElementById('video-generator-loader');
        const loaderMessage = document.getElementById('video-loader-message');
        const videoPlayer = document.getElementById('generated-video') as HTMLVideoElement;
        let imageFile: File | null = null;
        
        const updateVeoUI = () => {
            if (veoApiKeySelected) {
                keyPromptUI.style.display = 'none';
                generatorUI.style.display = 'block';
            } else {
                keyPromptUI.style.display = 'block';
                generatorUI.style.display = 'none';
            }
        };

        const checkVeoApiKey = async () => {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                veoApiKeySelected = true;
            } else {
                veoApiKeySelected = false;
            }
            updateVeoUI();
        };

        selectKeyBtn.addEventListener('click', async () => {
            await window.aistudio.openSelectKey();
            veoApiKeySelected = true; // Assume success to avoid race condition
            updateVeoUI();
        });

        videoUpload.addEventListener('change', () => {
            if (videoUpload.files && videoUpload.files[0]) {
                imageFile = videoUpload.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Video start image preview">`;
                };
                reader.readAsDataURL(imageFile);
            }
        });

        videoGeneratorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!imageFile) {
                alert('Please upload a starting image.');
                return;
            }
            
            generateBtn.disabled = true;
            loader.style.display = 'block';
            videoPlayer.style.display = 'none';
            loaderMessage.textContent = 'Preparing your video...';
            
            try {
                // Create new instance right before call to use latest key
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const imagePart = await fileToGenerativePart(imageFile);
                const aspectRatio = (videoGeneratorForm.querySelector('input[name="aspect-ratio"]:checked') as HTMLInputElement).value;

                let operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: videoPrompt.value,
                    image: { imageBytes: imagePart.data, mimeType: imagePart.mimeType },
                    config: {
                        numberOfVideos: 1,
                        resolution: '720p',
                        aspectRatio: aspectRatio as '16:9' | '9:16',
                    },
                });

                loaderMessage.textContent = 'Generating video, this may take a few minutes...';

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    operation = await ai.operations.getVideosOperation({ operation: operation });
                }

                const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (!downloadLink) throw new Error('Video generation failed or returned no link.');
                
                loaderMessage.textContent = 'Downloading video...';
                
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!videoResponse.ok) throw new Error(`Failed to download video: ${videoResponse.statusText}`);

                const videoBlob = await videoResponse.blob();
                const videoUrl = URL.createObjectURL(videoBlob);
                
                videoPlayer.src = videoUrl;
                videoPlayer.style.display = 'block';

            } catch (error) {
                 console.error('Video generation error:', error);
                 loaderMessage.textContent = `Error: ${error.message}`;
                 if (error.message.includes("Requested entity was not found")) {
                     loaderMessage.textContent = "API Key error. Please re-select your API key.";
                     veoApiKeySelected = false;
                     updateVeoUI();
                 }
            } finally {
                generateBtn.disabled = false;
                if (videoPlayer.style.display === 'block') {
                    loader.style.display = 'none';
                }
            }
        });
        
        // Initial check on load
        checkVeoApiKey();
    }

    // --- Text-to-Speech (TTS) Logic ---
    function decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async function decodeAudioData(
        data: Uint8Array,
        ctx: AudioContext,
        sampleRate: number,
        numChannels: number,
    ): Promise<AudioBuffer> {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    const ttsForm = document.getElementById('tts-form') as HTMLFormElement;
    if (ttsForm) {
        const ttsText = document.getElementById('tts-text') as HTMLTextAreaElement;
        const ttsBtn = document.getElementById('tts-btn') as HTMLButtonElement;
        const ttsLoader = document.getElementById('tts-loader');
        const ttsLoaderMessage = document.getElementById('tts-loader-message');
        const ttsOutput = document.getElementById('tts-output');
        let audioContext: AudioContext | null = null;

        ttsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textToSpeak = ttsText.value.trim();
            if (!textToSpeak) {
                alert('Please enter some text to generate speech.');
                return;
            }

            ttsBtn.disabled = true;
            ttsLoader.style.display = 'block';
            ttsLoaderMessage.textContent = 'Generating high-quality audio...';
            ttsOutput.innerHTML = '';

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: textToSpeak }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                        },
                    },
                });

                const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (!base64Audio) throw new Error('Audio data not found in response.');

                if (!audioContext) {
                    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();

                ttsOutput.innerHTML = `<p>Playing generated audio...</p>`;

            } catch (error) {
                console.error('TTS error:', error);
                ttsOutput.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            } finally {
                ttsBtn.disabled = false;
                ttsLoader.style.display = 'none';
            }
        });
    }
    
    // --- Product-Market Fit Analyzer Logic ---
    const pmfForm = document.getElementById('pmf-form') as HTMLFormElement;
    if (pmfForm) {
        const problemInput = document.getElementById('pmf-problem') as HTMLTextAreaElement;
        const audienceInput = document.getElementById('pmf-audience') as HTMLTextAreaElement;
        const competitorsInput = document.getElementById('pmf-competitors') as HTMLTextAreaElement;
        const generateBtn = document.getElementById('pmf-btn') as HTMLButtonElement;
        const loader = document.getElementById('pmf-loader');
        const resultsContainer = document.getElementById('pmf-results');

        pmfForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const problem = problemInput.value.trim();
            const audience = audienceInput.value.trim();
            const competitors = competitorsInput.value.trim();

            if (!problem || !audience || !competitors) {
                alert('Please fill out all fields to get an analysis.');
                return;
            }

            generateBtn.disabled = true;
            loader.style.display = 'block';
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';

            try {
                const prompt = `
                    Act as an experienced startup advisor providing feedback on a new business idea.
                    Analyze the following concept based on the details provided and give a concise, structured analysis.

                    **Product Idea:**
                    - **Problem it solves:** ${problem}
                    - **Target Audience:** ${audience}
                    - **Main Competitors:** ${competitors}

                    Please structure your feedback into three sections using Markdown headings:
                    ### Potential Strengths
                    (1-2 key positive aspects of this idea)
                    ### Potential Weaknesses
                    (1-2 critical challenges or risks to consider)
                    ### Key Questions to Answer
                    (2-3 important questions the founder should answer to validate this idea further)

                    Keep the tone constructive and the language clear and direct. Do not add any introductory or concluding paragraphs outside of these three sections.
                `;

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                const analysis = response.text;

                resultsContainer.innerHTML = `<h3>AI Analysis</h3><p>${analysis}</p>`;
                resultsContainer.style.display = 'block';

            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
                resultsContainer.style.display = 'block';
            } finally {
                generateBtn.disabled = false;
                loader.style.display = 'none';
            }
        });
    }

});