// src/src/components/cashier/checkout/ConfirmationScreen.tsx

import React, { useEffect } from "react";
import type { CartItem } from "@/types/pos";
import type { CreatedOrder, OrderFlowState } from "@/types/order";
import ConfirmationAnimation from "./ConfirmationAnimation";
import SendingAnimation from "./SendingAnimation";

interface ConfirmationScreenProps {
    isOpen: boolean;
    order: CreatedOrder | null;
    cart: CartItem[];
    orderFlowState: OrderFlowState;
    onConfirm: () => void;
    onCancel: () => void;
    onCompleted: () => void;
    error: string | null;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
    isOpen,
    order,
    cart,
    orderFlowState,
    onConfirm,
    onCancel,
    onCompleted,
    error,
}) => {
    // DEBUG: Log when component renders
    console.log("🟢 ConfirmationScreen rendered, orderFlowState:", orderFlowState);
    console.log("🟢 onConfirm is:", typeof onConfirm);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

    // Handle auto-redirect when completed
    useEffect(() => {
        if (orderFlowState === "COMPLETED") {
            const timer = setTimeout(() => {
                onCompleted();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [orderFlowState, onCompleted]);

    if (!isOpen || !order) {
        console.log("🔴 Not rendering: isOpen=", isOpen, "order=", order);
        return null;
    }

    const isConfirming = orderFlowState === "CONFIRMING";
    const isCompleted = orderFlowState === "COMPLETED";

    // DEBUG: Wrapper function to ensure click is captured
    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("🔵 BUTTON CLICKED! Calling onConfirm...");
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0a140c] overflow-hidden">
            <div className="flex h-full w-full">
                {/* Main Content Area - 2 Columns */}
                <main className="flex-1 flex flex-col p-8 relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#14b83d]/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-[#14b83d]/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Header */}
                    <header className="flex justify-between items-center mb-8 z-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#14b83d] p-2 rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined !text-2xl">coffee</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight uppercase italic leading-none text-white">
                                    BeanStream
                                </h2>
                                <p className="text-[10px] text-[#14b83d] font-bold uppercase tracking-widest">
                                    Cashier Station
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Order Status</p>
                                <p className="text-sm font-medium text-white">
                                    {isCompleted ? "Sent to Barista" : isConfirming ? "Confirming..." : "Awaiting Confirmation"}
                                </p>
                            </div>
                        </div>
                    </header>


                    {/* Two Columns Layout */}
                    <div className="flex-1 flex gap-6 z-10">
                        {/* Column 1: Payment Summary */}
                        <div className="w-1/3 flex flex-col">
                            <div className="bg-[#112115] border border-white/5 rounded-3xl p-6 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[#14b83d]">payments</span>
                                    <h3 className="text-lg font-bold text-white">Payment Summary</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                                            Payment Method
                                        </label>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-[#14b83d]/20 border-2 border-[#14b83d] text-[#14b83d] py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined !text-xl">money</span>
                                                Cash
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    Total Amount
                                                </label>
                                                <span className="text-xl font-bold text-white">
                                                    ${order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Payment Method</span>
                                                    <span className="text-lg font-bold text-white">{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {order.note && order.note !== "No note" && (
                                            <div className="bg-[#14b83d]/10 rounded-2xl p-4 border border-[#14b83d]/20">
                                                <label className="text-xs font-bold text-[#14b83d] uppercase tracking-widest block mb-1">
                                                    Order Note
                                                </label>
                                                <p className="text-sm text-white">{order.note}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <button
                                        onClick={onCancel}
                                        disabled={isConfirming || isCompleted}
                                        className="w-full py-3 border-gray-50 border rounded-md cursor-pointer text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined !text-lg">arrow_back</span>
                                        Back to Cart
                                    </button>
                                </div>
                            </div>
                        </div>



                        {/* Column 2: Finalize Order */}
                        <div className="flex-1 flex flex-col">
                            <div className="bg-[#112115] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full relative group">
                                <div className="absolute inset-0 bg-[#14b83d]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>


                                {/* Success State */}
                                {isCompleted ? (
                                    <div className="flex flex-col items-center animate-fade-in">
                                        {/* <div className="mb-6 p-6 bg-[#14b83d] rounded-full animate-bounce">
                                            <span className="material-symbols-outlined !text-6xl text-white">check</span>
                                        </div> */}
                                        <div className="inline-flex items-center justify-center mb-10">
                                        <SendingAnimation />
                                        </div>
                                        <h2 className="text-3xl font-black mb-3 text-white">Order Sent!</h2>
                                        <p className="text-gray-400 max-w-md">
                                            Order <span className="text-white font-bold">#{order.orderNumber}</span> has been sent to the barista station.
                                        </p>
                                        <p className="text-sm text-gray-500 mt-4">Redirecting to menu...</p>
                                    </div>
                                ) : (
                                    <>
                                         
                                         {/* Animation WAITING */}
                                        <div className="inline-flex items-center justify-center mb-10">
                                        <ConfirmationAnimation />
                                        </div>


                                        <h2 className="text-3xl font-black mb-3 text-white">Finalize Order</h2>

                                        <p className="text-gray-400 max-w-md mb-8">
                                            Confirm and send Order{" "}
                                            <span className="text-white font-bold">#{order.orderNumber}</span> to the barista station for preparation.
                                        </p>

                                        {error && (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 max-w-md">
                                                <p className="text-red-400 text-sm">{error}</p>
                                            </div>
                                        )}

                                        {/* DEBUG BUTTON - Simplified for testing */}
                                        <button
                                            onClick={handleButtonClick}
                                            disabled={isConfirming}
                                            style={{
                                                cursor: 'pointer',
                                                pointerEvents: 'auto'
                                            }}
                                            className="w-full cursor-pointer z-10 max-w-md py-6 bg-[#14b83d] hover:bg-[#0f8a2e] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-2xl shadow-[0_20px_50px_rgba(20,184,61,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-1"
                                        >
                                            {isConfirming ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span className="text-xl font-black uppercase tracking-tight">Confirming...</span>
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-xl font-black uppercase tracking-tight">Confirm & Send to Barista</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>


                {/* Column 3: Review Order Sidebar */}
                <aside className="w-[400px] bg-[#112115] border-l border-white/5 flex flex-col shadow-2xl relative z-20">
                    <div className="p-6 border-b border-white/5 bg-black/10">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xl font-bold text-white">Review Order</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${
                                isCompleted 
                                    ? "bg-[#14b83d]/20 text-[#14b83d] border-[#14b83d]/30" 
                                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                            }`}>
                                {isCompleted ? "QUEUED" : "CREATED"}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">
                            Order #{order.orderNumber}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div
                                    className="h-16 w-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-white/5"
                                    style={{
                                        backgroundImage: `url(${item.image_url || "https://placehold.co/100x100?text=No+Image"})`,
                                    }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                            <p className="text-gray-500 text-xs">
                                                Qty: {item.cartQuantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-bold text-white">
                                            ${(item.price * item.cartQuantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-black/40 border-t border-white/5 pb-14">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 mt-2 border-t border-white/10 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total Due</span>
                                <span className="text-2xl font-black text-[#14b83d]">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};