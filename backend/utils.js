import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
import User from './models/userModel.js';

export const generateToken = (user) => {
    const { _id, name, email, isAdmin, isSeller } = user;
    const userData = {
        _id,
        name,
        email,
        isAdmin,
        isSeller
    };

    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token' });
    }
};

export const isSeller = (req, res, next) => {
    if (req.user && req.user.isSeller) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Seller Token' });
    }
};

export const isSellerOrAdmin = (req, res, next) => {
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin/Seller Token' });
    }
};

export const subscriptionValidation = async (req, res, next) => {
    const { userInfo, plan } = req.body
    const user = await User.findById(userInfo._id).populate('subscription');

    // Matching data found in the database and the request body
    try {
        if (user.subscription || userInfo.subscription) {
            if (user.subscription.status !== userInfo.subscription.status || new Date(userInfo.subscription.endDate).getTime() !== new Date(user.subscription.endDate).getTime()) {
                return res.status(403).send({ message: 'Validation failed' });
            }
        }
    } catch (error) {
        return res.status(403).send({ message: 'Validation failed with exception' });
    }

    // If the user has an active subscription
    if (user.subscription) {
        if (!user.subscription.isExpired()) {
            return res.status(403).send({ message: 'User already has subscription' });
        }
    }

    // If the user has already used a 8-month subscription
    if (userInfo.subscription !== null && plan === '8-month') {
        res.status(403).send({ message: '8-month subscription is not available' });
    }

    next();
};


export const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });

export const payOrderEmailTemplate = (order) => {
    return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${order.user.name},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems.map((item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.quantity}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    ).join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};
