import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Mail, Check } from 'lucide-react';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! Soy el asistente virtual de Saúl. Puedes preguntarme sobre sus proyectos, habilidades, experiencia o cualquier cosa que quieras saber. ¿En qué puedo ayudarte?'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [threadId, setThreadId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Estados del formulario de contacto
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactData, setContactData] = useState({
        name: '',
        message: '',
        email: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showDataWarning, setShowDataWarning] = useState(false);

    // Auto-scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus en input cuando se abre el chat
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Añadir mensaje del usuario
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Llamar a la función de Netlify
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    threadId,
                    message: userMessage,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al comunicarse con el servidor');
            }

            const data = await response.json();

            // Guardar threadId para mantener la conversación
            if (data.threadId) {
                setThreadId(data.threadId);
            }

            // Añadir respuesta del asistente
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response
            }]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Funciones del formulario de contacto
    const handleContactInputChange = (field, value) => {
        setContactData(prev => ({ ...prev, [field]: value }));

        // Mostrar aviso si detectamos datos personales (email o teléfono)
        if ((field === 'email' || field === 'phone') && value && !showDataWarning) {
            setShowDataWarning(true);
        }
    };

    const handleSubmitContact = async () => {
        // Validaciones básicas
        if (!contactData.name.trim()) {
            alert('Por favor, ingresa tu nombre');
            return;
        }

        if (!contactData.message.trim()) {
            alert('Por favor, ingresa un mensaje');
            return;
        }

        // Solo permitir email o teléfono si se acepta la política
        if ((contactData.email || contactData.phone) && !showDataWarning) {
            setShowDataWarning(true);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/.netlify/functions/save-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: contactData.name.trim(),
                    message: contactData.message.trim(),
                    email: contactData.email.trim() || null,
                    phone: contactData.phone.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el mensaje');
            }

            // Éxito
            setSubmitSuccess(true);

            // Después de 3 segundos, cerrar el formulario
            setTimeout(() => {
                setShowContactForm(false);
                setSubmitSuccess(false);
                setContactData({ name: '', message: '', email: '', phone: '' });
                setShowDataWarning(false);

                // Añadir mensaje de confirmación en el chat
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '¡Gracias por tu mensaje! Saúl se pondrá en contacto contigo pronto. 😊'
                }]);
            }, 3000);

        } catch (error) {
            console.error('Error submitting contact:', error);
            alert(error.message || 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-lg hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Abrir chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Ventana de chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)]"
                    >
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 h-full flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 p-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Asistente de Saúl</h3>
                                        <p className="text-xs text-gray-400">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón Dejar Mensaje */}
                            {!showContactForm && (
                                <div className="p-3 border-b border-white/10">
                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                    >
                                        <Mail className="w-4 h-4" />
                                        ✉️ Dejar Mensaje para Saúl
                                    </button>
                                </div>
                            )}

                            {/* Formulario de Contacto */}
                            <AnimatePresence>
                                {showContactForm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute inset-0 bg-black/95 backdrop-blur-xl z-10 overflow-y-auto">
                                        <div className="p-6">
                                            {!submitSuccess ? (
                                                <>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-xl font-bold text-white">Contactar con Saúl</h3>
                                                        <button
                                                            onClick={() => {
                                                                setShowContactForm(false);
                                                                setShowDataWarning(false);
                                                            }}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-5 h-5 text-gray-400" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Nombre */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Nombre *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={contactData.name}
                                                                onChange={(e) => handleContactInputChange('name', e.target.value)}
                                                                placeholder="Tu nombre completo"
                                                                maxLength={100}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                                                            />
                                                        </div>

                                                        {/* Mensaje */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Mensaje *
                                                            </label>
                                                            <textarea
                                                                value={contactData.message}
                                                                onChange={(e) => handleContactInputChange('message', e.target.value)}
                                                                placeholder="Escribe tu mensaje aquí..."
                                                                rows={4}
                                                                maxLength={1000}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {contactData.message.length}/1000 caracteres
                                                            </p>
                                                        </div>

                                                        {/* Email */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Email (opcional)
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={contactData.email}
                                                                onChange={(e) => handleContactInputChange('email', e.target.value)}
                                                                placeholder="tu.email@ejemplo.com"
                                                                maxLength={100}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                                                            />
                                                        </div>

                                                        {/* Teléfono */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Teléfono (opcional)
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={contactData.phone}
                                                                onChange={(e) => handleContactInputChange('phone', e.target.value)}
                                                                placeholder="+34 123 456 789"
                                                                maxLength={20}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                                                            />
                                                        </div>

                                                        {/* Aviso RGPD - Solo si hay datos personales */}
                                                        {showDataWarning && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"
                                                            >
                                                                <p className="text-xs text-yellow-200 mb-2">
                                                                    ⚠️ <strong>Protección de Datos</strong>
                                                                </p>
                                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                                    Solo guardaremos tu <strong>nombre, número de teléfono y correo electrónico</strong> para contactarte.
                                                                    Cualquier otra información que incluyas en el mensaje no nos hacemos responsables de su almacenamiento.
                                                                    Tus datos serán utilizados únicamente para responder a tu solicitud y no se compartirán con terceros.
                                                                </p>
                                                            </motion.div>
                                                        )}

                                                        {/* Botón Enviar */}
                                                        <button
                                                            onClick={handleSubmitContact}
                                                            disabled={isSubmitting || !contactData.name.trim() || !contactData.message.trim()}
                                                            className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-80 text-white font-medium py-3 px-4 rounded-xl transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                        >
                                                            {isSubmitting ? (
                                                                <>
                                                                    <motion.div
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                                    />
                                                                    Enviando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="w-5 h-5" />
                                                                    Enviar Mensaje
                                                                </>
                                                            )}
                                                        </button>

                                                        <p className="text-xs text-gray-500 text-center">
                                                            Los campos marcados con * son obligatorios
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                /* Mensaje de Éxito */
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-center py-12"
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2, type: 'spring' }}
                                                        className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                                    >
                                                        <Check className="w-10 h-10 text-white" />
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                                                    <p className="text-gray-400">
                                                        Gracias por contactar. Saúl recibirá tu mensaje y se pondrá en contacto contigo pronto.
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Mensajes */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                            : 'bg-gradient-to-r from-neon-cyan to-neon-purple'
                                            }`}>
                                            {message.role === 'user' ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        {/* Mensaje */}
                                        <div className={`max-w-[70%] rounded-2xl p-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                                            : 'bg-white/5 border border-white/10'
                                            }`}>
                                            <p className="text-sm text-white whitespace-pre-wrap break-words">
                                                {message.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Indicador de carga */}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                                            <div className="flex gap-1">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                    className="w-2 h-2 bg-neon-cyan rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                    className="w-2 h-2 bg-neon-cyan rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                    className="w-2 h-2 bg-neon-cyan rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <div className="flex gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Escribe tu mensaje..."
                                        disabled={isLoading}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors disabled:opacity-50"
                                        maxLength={500}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="p-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Enviar mensaje"
                                    >
                                        <Send className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {inputValue.length}/500 caracteres
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Estilos para scrollbar personalizada */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.5);
        }
      `}</style>
        </>
    );
}

export default Chatbot;
