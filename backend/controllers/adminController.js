import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import { validatePassword, isValidObjectId } from '../middleware/validation.js';

// @desc   Get Administrator Dashboard Statistics
// @route  GET /api/admin/dashboard
// @access Admin only
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRestaurants, totalReviews, ratingStats, usersByRole] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Review.countDocuments(),
      Review.aggregate([
        {
          $group: {
            _id: null,
            averagePlatformRating: { $avg: '$rating' },
          },
        },
      ]),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const avgRating = ratingStats[0]?.averagePlatformRating
      ? Number(ratingStats[0].averagePlatformRating.toFixed(2))
      : 0;

    const roleBreakdown = { customer: 0, owner: 0, admin: 0 };
    usersByRole.forEach((u) => {
      roleBreakdown[u._id] = u.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        totalReviews,
        averagePlatformRating: avgRating,
        roleBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all users with search and filter
// @route  GET /api/admin/users
// @access Admin only
export const getUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (role && ['customer', 'owner', 'admin'].includes(role)) {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create Restaurant Owner account
// @route  POST /api/admin/owners
// @access Admin only
export const createRestaurantOwner = async (req, res, next) => {
  try {
    const { name, email, password, restaurantId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required to create a restaurant owner.',
      });
    }

    const pwdCheck = validatePassword(password);
    if (!pwdCheck.valid) {
      return res.status(400).json({ success: false, message: pwdCheck.message });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const owner = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'owner',
    });

    // Optionally assign to an existing restaurant immediately
    let assignedRestaurant = null;
    if (restaurantId) {
      if (isValidObjectId(restaurantId)) {
        assignedRestaurant = await Restaurant.findByIdAndUpdate(
          restaurantId,
          { owner: owner._id },
          { new: true }
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Restaurant owner account created successfully.',
      data: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        assignedRestaurant: assignedRestaurant ? assignedRestaurant.name : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Assign owner to a restaurant
// @route  PUT /api/admin/restaurants/:restaurantId/assign-owner
// @access Admin only
export const assignOwnerToRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { ownerId } = req.body;

    if (!isValidObjectId(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID' });
    }

    if (ownerId && !isValidObjectId(ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid owner user ID' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (ownerId) {
      const user = await User.findById(ownerId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Owner user not found' });
      }
      if (user.role !== 'owner' && user.role !== 'admin') {
        // Automatically promote user role to owner if requested
        user.role = 'owner';
        await user.save();
      }
      restaurant.owner = ownerId;
    } else {
      restaurant.owner = null;
    }

    await restaurant.save();
    const populated = await restaurant.populate('owner', 'name email');

    return res.status(200).json({
      success: true,
      message: ownerId ? 'Owner assigned to restaurant successfully.' : 'Owner unassigned from restaurant.',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all reviews for moderation
// @route  GET /api/admin/reviews
// @access Admin only
export const getAllReviewsForAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('customer', 'name email')
      .populate('restaurant', 'name location cuisine')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};
