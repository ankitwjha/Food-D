import React, { useState, useContext } from 'react';
import './AIPlateBuilder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const AIPlateBuilder = () => {
    const { url, token, addToCart, setShowAuthAlert, food_list } = useContext(StoreContext);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await axios.post(`${url}/api/food/recommend`, { prompt });
            if (response.data.success) {
                setResult(response.data);
            } else {
                setError(response.data.message || "Could not generate recommendation. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to connect to AI server. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComboToCart = () => {
        if (!token) {
            setShowAuthAlert(true);
            return;
        }

        if (!result || !result.items || result.items.length === 0) return;

        result.items.forEach(item => {
            const qty = item.quantity || 1;
            for (let i = 0; i < qty; i++) {
                addToCart(item.id);
            }
        });

        alert("✨ Custom AI Plate Combo added to your cart!");
    };

    // Find image URL for menu items to show nice previews
    const getItemImage = (itemId) => {
        const item = food_list.find(f => f._id === itemId);
        return item ? (item.image && item.image.startsWith("data:") ? item.image : `${url}/images/${item.image}`) : null;
    };

    return (
        <div className="ai-plate-builder glass-card">
            <div className="ai-header">
                <span className="ai-badge">🤖 Your Personal Foodie Assistant</span>
                <h3>AI Plate Builder & Cravings Assistant</h3>
                <p>Describe your budget, dietary limits, or current mood, and let AI craft your customized meal combo!</p>
            </div>

            <form onSubmit={handleSubmit} className="ai-input-form">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your craving here... (e.g. I have ₹300, feeling stressed, want something high-protein and dairy-free)"
                    rows="2"
                    required
                />
                <button type="submit" disabled={loading} className="btn-ai-submit">
                    {loading ? (
                        <div className="ai-spinner"></div>
                    ) : (
                        "Craft My Plate ➜"
                    )}
                </button>
            </form>

            {error && <div className="ai-error-message">{error}</div>}

            {result && (
                <div className="ai-result-container">
                    <div className="ai-recommendation-bubble">
                        <h4>Chef's AI Note:</h4>
                        <p>{result.recommendation}</p>
                    </div>

                    <div className="ai-combo-items-list">
                        <h4>Your Custom Combo:</h4>
                        <div className="ai-items-grid">
                            {result.items.map((item, idx) => {
                                const imgUrl = getItemImage(item.id);
                                return (
                                    <div key={idx} className="ai-item-card">
                                        {imgUrl && <img src={imgUrl} alt={item.name} className="ai-item-img" />}
                                        <div className="ai-item-details">
                                            <span className="ai-item-name">{item.name}</span>
                                            <span className="ai-item-meta">
                                                Qty: {item.quantity} | ₹{item.price} each
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="ai-result-footer">
                        <div className="ai-total-price">
                            <span>Total Price:</span>
                            <strong>₹{result.totalPrice}.00</strong>
                        </div>
                        <button onClick={handleAddComboToCart} className="btn-ai-add-cart">
                            Add Combo to Cart 🛒
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIPlateBuilder;
