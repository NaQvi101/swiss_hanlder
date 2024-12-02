import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { API_URL } from '../utils';

const SubscriptionScreen = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const cancel = searchParams.get('cancel');

        if (cancel) {
            toast.error('Payment process was canceled \n or some Error occured during Payment Processing.');
        }

        // Clear query parameters after handling
        window.history.replaceState(null, '', window.location.href);
    }, [searchParams]);

    const handlePayment = async (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const confirmPayment = async () => {
        try {
            setLoading(true);

            const { data } = await axios.post(
                `${API_URL}api/stripe/checkout-session`,
                { plan: selectedPlan, userInfo },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            // Redirect to Stripe Checkout page
            window.location.href = data.url;
        } catch (error) {
            console.error('Error during payment initiation:', error.message);
            toast.error('Something went wrong with the payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-[#cb202c] mb-4">Choose Your Subscription Plan</h1>
                <p className="max-w-2xl text-lg text-gray-700">
                    Unlock access to premium features and streamline your business. Select the plan that best fits your goals and start uploading your products today.
                </p>
            </div>

            <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
                <div className="p-6 transition bg-white rounded-lg shadow-lg hover:shadow-2xl">
                    <h2 className="text-2xl font-bold text-[#cb202c] mb-4">Annual Plan</h2>                   
                    <p className="mb-4 text-gray-700"><b>Swiss handel offers a comprehensive yearly membership for established companies to expand market reach and solidify business relationships effectively.</b></p>
                    <p className="mb-4 text-gray-700"><b>Post Unlimited Products :</b> Suppliers can list an unlimited number of products, showcasing their full inventory to potential European buyers.</p>
                    <p className="mb-4 text-gray-700"><b>Connect with Clients : </b>Suppliers can establish connections with European businesses, expanding their network and finding new opportunities.</p>
                    <p className="mb-4 text-gray-700"><b>Communicate Directly with Buyers :</b> A built-in messaging system allows suppliers to communicate directly with potential buyers, negotiating deals or addressing inquiries in real-time.</p>
                    <p className="mb-4 text-gray-700"><b>Post Videos of Proof of Production :</b> Suppliers can upload videos that demonstrate their production capabilities, providing transparency and building trust with European clients.</p>
                    <p className="mb-6 text-lg font-semibold text-gray-800">€699 per year</p>
                    <button onClick={() => handlePayment('annual')} className="w-full bg-[#cb202c] text-white py-2 px-4 rounded hover:bg-[#cb202c] transition"> Pay </button>
                </div>
                <div className="p-6 transition bg-white rounded-lg shadow-lg hover:shadow-2xl">
                    <h2 className="text-2xl font-bold text-[#cb202c] mb-4">8-Month Plan</h2>
                    <p  className="mb-4 text-gray-700"> <b>Swiss handel offers a 8-month trial for new companies, designed to enhance efficiency and provide an opportunity to evaluate market potential.</b></p>
                    <p className="mb-4 text-gray-700"><b>Post Unlimited Products :</b> Suppliers can list an unlimited number of products, showcasing their full inventory to potential European buyers.</p>
                    <p className="mb-4 text-gray-700"><b>Connect with Clients :</b> Suppliers can establish connections with European businesses, expanding their network and finding new opportunities.</p>
                    <p className="mb-4 text-gray-700"><b>Communicate Directly with Buyers :</b> A built-in messaging system allows suppliers to communicate directly with potential buyers, negotiating deals or addressing inquiries in real-time.</p>
                    <p className="mb-4 text-gray-700"><b>Post Videos of Proof of Production :</b> Suppliers can upload videos that demonstrate their production capabilities, providing transparency and building trust with European clients.</p>

                    <p className="mb-6 text-lg font-semibold text-gray-800">€325 one-time</p>
                    <button disabled={userInfo.subscription !== null} onClick={() => handlePayment('8-month')} className={`w-full py-2 px-4 rounded transition ${userInfo.subscription !== null ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-[#cb202c] text-white hover:bg-[#cb202c]'}`}> Pay </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-[#cb202c] mb-4">Confirm Your Payment</h3>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to proceed with the <span className="font-semibold">{selectedPlan}</span>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={closeModal} className="px-4 py-2 text-gray-700 transition bg-gray-300 rounded hover:bg-gray-400"> Cancel </button>
                            <button onClick={confirmPayment} className="bg-[#cb202c] text-white py-2 px-4 rounded hover:bg-[#cb202c] transition" disabled={loading}>
                                {loading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionScreen;
