import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';

const SuccessScreen = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [transactionDetails, setTransactionDetails] = useState(null);
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        if (sessionId) {
            // Fetch session details from your backend
            axios
                .post(`${API_URL}api/stripe/checkout-session/${sessionId}`,
                    { userInfo },
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                )
                .then((response) => {
                    setTransactionDetails(response.data);
                    console.log('Transaction details:', response.data);
                })
                .catch((error) => {
                    console.error('Error fetching session details:', error);
                });
            window.history.replaceState(null, '', window.location.href);
        }
    }, [sessionId]);

    if (!transactionDetails)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-orange-500 text-lg">No details available</div>
            </div>
        );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8">
                <div className="text-center mb-6">
                    <div className="text-orange-500 text-5xl mb-4">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Successful</h1>
                    <p className="text-gray-600 mt-2">
                        Thank you for your payment! You can now proceed to your product page or dashboard.
                    </p>
                </div>
                <div className="mb-6">
                    <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Detail</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Transaction Status</td>
                                <td className="border border-gray-300 px-4 py-2">{transactionDetails.payment_status}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Amount Paid</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {transactionDetails.amount_total / 100} {transactionDetails.currency.toUpperCase()}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Email</td>
                                <td className="border border-gray-300 px-4 py-2">{transactionDetails.customer_details.email}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Name</td>
                                <td className="border border-gray-300 px-4 py-2">{transactionDetails.customer_details.name}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Plan Purchased</td>
                                <td className="border border-gray-300 px-4 py-2">{transactionDetails.metadata.plan}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            window.location.href = '/seller/products'; // Update the URL as needed
                        }}
                    >
                        Go to Products
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            window.location.href = '/'; // Update the URL as needed
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessScreen;
