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
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-orange-500 mb-4">Choose Your Subscription Plan</h1>
                <p className="text-gray-700 text-lg max-w-2xl">
                    Unlock access to premium features and streamline your business. Select the plan that best fits your goals and start uploading your products today.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Annual Plan</h2>
                    <p className="text-gray-700 mb-4">Pay a one-time fee to upload your products and enjoy uninterrupted access for the entire year. Ideal for businesses looking for long-term stability and growth.</p>
                    <p className="text-lg font-semibold text-gray-800 mb-6">€325 per year</p>
                    <button onClick={() => handlePayment('annual')} className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"> Pay </button>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">6-Month Plan</h2>
                    <p className="text-gray-700 mb-4">Perfect for first-time users. Try our platform for six months before committing to the yearly plan. Future renewals will be billed annually.</p>
                    <p className="text-lg font-semibold text-gray-800 mb-6">€149 one-time</p>
                    <button disabled={userInfo.subscription !== null} onClick={() => handlePayment('6-month')} className={`w-full py-2 px-4 rounded transition ${userInfo.subscription !== null ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}> Pay </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-orange-500 mb-4">Confirm Your Payment</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to proceed with the <span className="font-semibold">{selectedPlan}</span>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={closeModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"> Cancel </button>
                            <button onClick={confirmPayment} className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition" disabled={loading}>
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
