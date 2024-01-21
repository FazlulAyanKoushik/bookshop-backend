const fs = require('fs');
const os = require("os");
const Admin = require('../models/admin');
const Author = require('../models/author');
const AuthorFilter = require('../models/author-filter');
const Blog = require('../models/blog');
const Book = require('../models/book');
const BookExtraData = require('../models/book-extra-data');
const Carousel = require('../models/carousel');
const Cart = require('../models/cart');
const Category = require('../models/category');
const CategoryFilter = require('../models/category-filter');
const CategoryProduct = require('../models/category-product');
const Company = require('../models/company');
const ContactInfo = require('../models/contact-info');
const ContactUs = require('../models/contact-us');
const Country = require('../models/country');
const Coupon = require('../models/coupon');
const ExtraData = require('../models/extra-data');
const GiftInfo = require('../models/gift-info');
const home = require('../models/home');
const HorizontalSub = require('../models/horizontalSub');
const Menu = require('../models/menu');
const Newsletter = require('../models/newsletter');
const OfferProduct = require('../models/offer-product');
const OfferSlide = require('../models/offer-slider');
const Order = require('../models/order');
const OrderPaymentInfo = require('../models/order-payment-info');
const OrderTemporary = require('../models/order-temporary');
const PageInfo = require('../models/page-info');
const PriceExtraData = require('../models/price-extra-data');
const Product = require('../models/product');
const Publisher = require('../models/publisher');
const PublisherFilter = require('../models/publisher-filter');
const Review = require('../models/review');
const ReviewControl = require('../models/review-control');
const Reward = require('../models/reward');
const Role = require('../models/role');
const SaleTag = require('../models/sale-tag');
const SideMenu = require('../models/side-menu');
const SubCategory = require('../models/sub-category');
const SubCategoryFilter = require('../models/sub-category-filter');
const Tag = require('../models/tag');
const UniqueId = require('../models/unique-id');
const User = require('../models/user');
const Wishlist = require('../models/wishlist');


const STATIC_DIR = `./database/backup/`;
const STATIC_DIR_PATH = `/database/backup/`;

exports.backupCollection = async (req, res, next) => {

    try {
        const collectionName = req.body.collectionName.trim();
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            const data = await model.find();

            if (!fs.existsSync(STATIC_DIR)) {
                fs.mkdir(STATIC_DIR, () => {
                    fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));
                });

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`
                });
            } else {
                fs.writeFileSync(STATIC_DIR + fileName, JSON.stringify(data));

                res.status(200).json({
                    success: true,
                    message: `${collectionName} model backup successfully`
                });
            }
        } else {
            res.status(200).json({
                success: false,
                message: `${collectionName} model has not exists`
            });
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.restoreCollection = async (req, res, next) => {

    try {
        const collectionName = req.body.collectionName.trim();
        const force = req.body.force;
        const hasCollection = getModelData(collectionName);

        if (hasCollection) {
            // Model Data
            const model = hasCollection.model;
            const fileName = hasCollection.fileName;

            if (fs.existsSync(STATIC_DIR + fileName)) {
                const data = fs.readFileSync(STATIC_DIR + fileName);
                const docs = JSON.parse(data.toString());
                const backupLength = docs && docs.length ? docs.length : 0;
                const documentsLength = await model.countDocuments();

                if (!force) {
                    if (backupLength < documentsLength) {
                        res.status(200).json({
                            success: false,
                            message: `${collectionName} model length is ${documentsLength} but backup data length is ${backupLength}`
                        });
                    } else {
                        await model.deleteMany({});
                        await model.insertMany(docs);

                        res.status(200).json({
                            success: true,
                            message: `${collectionName} model restore successfully`
                        });
                    }
                } else {
                    await model.deleteMany({});
                    await model.insertMany(docs);

                    res.status(200).json({
                        success: true,
                        message: `${collectionName} model restore successfully`
                    });
                }

            } else {
                res.status(200).json({
                    success: false,
                    message: 'No Backup file found!'
                });
            }
        } else {
            res.status(200).json({
                success: false,
                data: `${collectionName} model has not exists`
            });
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCollectionList = async (req, res, next) => {

    try {
        const collections = getModelWithFileData();

        res.status(200).json({
            success: true,
            data: collections
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


function getModelData(collectionName) {
    let model;
    let fileName;

    switch (collectionName) {

        case 'Admin': case 'admin':
            model = Admin;
            fileName = `admin.json`;
            break;
        case 'Author': case 'author':
            model = Author;
            fileName = `author.json`;
            break;
        case 'AuthorFilter': case 'author-filter': case 'authorFilter':
            model = AuthorFilter;
            fileName = `author-filter.json`;
            break;
        case 'Blog': case 'blog':
            model = Blog;
            fileName = `blog.json`;
            break;
        case 'Book': case 'book':
            model = Book;
            fileName = `book.json`;
            break;
        case 'BookExtraData': case 'book-extra-data': case 'bookExtraData':
            model = BookExtraData;
            fileName = `book-extra-data.json`;
            break;
        case 'Carousel': case 'carousel':
            model = Carousel;
            fileName = `carousel.json`;
            break;
        case 'Cart': case 'cart':
            model = Cart;
            fileName = `cart.json`;
            break;
        case 'Category': case 'category':
            model = Category;
            fileName = `category.json`;
            break;
        case 'CategoryFilter': case 'category-filter':
            model = CategoryFilter;
            fileName = `category-filter.json`;
            break;
        case 'CategoryProduct': case 'category-product':
            model = CategoryProduct;
            fileName = `category-product.json`;
            break;
        case 'Company': case 'company':
            model = Company;
            fileName = `company.json`;
            break;
        case 'ContactInfo': case 'contact-info':
            model = ContactInfo;
            fileName = `contact-info.json`;
            break;
        case 'ContactUs': case 'contact-us':
            model = ContactUs;
            fileName = `contact-us.json`;
            break;
        case 'Country': case 'country':
            model = Country;
            fileName = `country.json`;
            break;
        case 'Coupon': case 'coupon':
            model = Coupon;
            fileName = `coupon.json`;
            break;
        case 'ExtraData': case 'extra-data':
            model = ExtraData;
            fileName = `extra-data.json`;
            break;
        case 'GiftInfo': case 'gift-info':
            model = GiftInfo;
            fileName = `gift-info.json`;
            break;
        case 'Home': case 'home':
            model = home;
            fileName = `home.json`;
            break;
        case 'HorizontalSub': case 'horizontal-sub':
            model = HorizontalSub;
            fileName = `horizontal-sub.json`;
            break;
        case 'Menu': case 'menu':
            model = Menu;
            fileName = `menu.json`;
            break;
        case 'Newsletter': case 'newsletter':
            model = Newsletter;
            fileName = `newsletter.json`;
            break;
        case 'OfferProduct': case 'offer-product':
            model = OfferProduct;
            fileName = `offer-product.json`;
            break;
        case 'OfferSlide': case 'offer-slide':
            model = OfferSlide;
            fileName = `offer-slide.json`;
            break;
        case 'Order': case 'order':
            model = Order;
            fileName = `order.json`;
            break;
        case 'OrderPaymentInfo': case 'order-payment-info':
            model = OrderPaymentInfo;
            fileName = `order-payment-info.json`;
            break;
        case 'OrderTemporary': case 'order-temporary':
            model = OrderTemporary;
            fileName = `order-temporary.json`;
            break;
        case 'PageInfo': case 'page-info':
            model = PageInfo;
            fileName = `page-info.json`;
            break;
        case 'PriceExtraData': case 'price-extra-data':
            model = PriceExtraData;
            fileName = `price-extra-data.json`;
            break;
        case 'Product': case 'product':
            model = Product;
            fileName = `product.json`;
            break;
        case 'Publisher': case 'publisher':
            model = Publisher;
            fileName = `publisher.json`;
            break;
        case 'PublisherFilter': case 'publisher-filter':
            model = PublisherFilter;
            fileName = `publisher-filter.json`;
            break;
        case 'Review': case 'review':
            model = Review;
            fileName = `review.json`;
            break;
        case 'ReviewControl': case 'review-control':
            model = ReviewControl;
            fileName = `review-control.json`;
            break;
        case 'Reward': case 'reward':
            model = Reward;
            fileName = `reward.json`;
            break;
        case 'Role': case 'role':
            model = Role;
            fileName = `role.json`;
            break;
        case 'SaleTag': case 'sale-tag':
            model = SaleTag;
            fileName = `sale-tag.json`;
            break;
        case 'SideMenu': case 'side-menu':
            model = SideMenu;
            fileName = `side-menu.json`;
            break;
        case 'SubCategory': case 'sub-category':
            model = SubCategory;
            fileName = `sub-category.json`;
            break;
        case 'SubCategoryFilter': case 'sub-category-filter':
            model = SubCategoryFilter;
            fileName = `sub-category-filter.json`;
            break;
        case 'Tag': case 'tag':
            model = Tag;
            fileName = `tag.json`;
            break;
        case 'UniqueId': case 'unique-id':
            model = UniqueId;
            fileName = `unique-id.json`;
            break;
        case 'User': case 'user':
            model = User;
            fileName = `user.json`;
            break;
        case 'Wishlist': case 'wishlist':
            model = Wishlist;
            fileName = `wishlist.json`;
            break;
        default:
            console.log(`Sorry, we are out of ${collectionName}.`);
    }

    if (model && fileName) {
        return {model, fileName}
    } else {
        return null;
    }
}

function getModelWithFileData() {
    return [
        {
            name: 'Admin',
            size: fileInfo(STATIC_DIR + 'admin.json').size,
            lastModified: fileInfo(STATIC_DIR + 'admin.json').mtime
        },
        {
            name: 'Author',
            size: fileInfo(STATIC_DIR + 'author.json').size,
            lastModified: fileInfo(STATIC_DIR + 'author.json').mtime
        },
        {
            name: 'AuthorFilter',
            size: fileInfo(STATIC_DIR + 'author-filter.json').size,
            lastModified: fileInfo(STATIC_DIR + 'author-filter.json').mtime
        },
        {
            name: 'Blog',
            size: fileInfo(STATIC_DIR + 'blog.json').size,
            lastModified: fileInfo(STATIC_DIR + 'blog.json').mtime
        },
        {
            name: 'Book',
            size: fileInfo(STATIC_DIR + 'book.json').size,
            lastModified: fileInfo(STATIC_DIR + 'book.json').mtime
        },
        {
            name: 'BookExtraData',
            size: fileInfo(STATIC_DIR + 'book-extra-data.json').size,
            lastModified: fileInfo(STATIC_DIR + 'book-extra-data.json').mtime
        },
        {
            name: 'Carousel',
            size: fileInfo(STATIC_DIR + 'carousel.json').size,
            lastModified: fileInfo(STATIC_DIR + 'carousel.json').mtime
        },
        {
            name: 'Cart',
            size: fileInfo(STATIC_DIR + 'cart.json').size,
            lastModified: fileInfo(STATIC_DIR + 'cart.json').mtime
        },
        {
            name: 'Category',
            size: fileInfo(STATIC_DIR + 'category.json').size,
            lastModified: fileInfo(STATIC_DIR + 'category.json').mtime
        },
        {
            name: 'CategoryFilter',
            size: fileInfo(STATIC_DIR + 'category-filter.json').size,
            lastModified: fileInfo(STATIC_DIR + 'category-filter.json').mtime
        },
        {
            name: 'CategoryProduct',
            size: fileInfo(STATIC_DIR + 'category-product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'category-product.json').mtime
        },
        {
            name: 'Company',
            size: fileInfo(STATIC_DIR + 'company.json').size,
            lastModified: fileInfo(STATIC_DIR + 'company.json').mtime
        },
        {
            name: 'ContactInfo',
            size: fileInfo(STATIC_DIR + 'contact-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'contact-info.json').mtime
        },
        {
            name: 'ContactUs',
            size: fileInfo(STATIC_DIR + 'contact-us.json').size,
            lastModified: fileInfo(STATIC_DIR + 'contact-us.json').mtime
        },
        {
            name: 'Country',
            size: fileInfo(STATIC_DIR + 'country.json').size,
            lastModified: fileInfo(STATIC_DIR + 'country.json').mtime
        },
        {
            name: 'Coupon',
            size: fileInfo(STATIC_DIR + 'coupon.json').size,
            lastModified: fileInfo(STATIC_DIR + 'coupon.json').mtime
        },
        {
            name: 'ExtraData',
            size: fileInfo(STATIC_DIR + 'extra-data.json').size,
            lastModified: fileInfo(STATIC_DIR + 'extra-data.json').mtime
        },
        {
            name: 'GiftInfo',
            size: fileInfo(STATIC_DIR + 'gift-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'gift-info.json').mtime
        },
        {
            name: 'Home',
            size: fileInfo(STATIC_DIR + 'home.json').size,
            lastModified: fileInfo(STATIC_DIR + 'home.json').mtime
        },
        {
            name: 'HorizontalSub',
            size: fileInfo(STATIC_DIR + 'horizontal-sub.json').size,
            lastModified: fileInfo(STATIC_DIR + 'horizontal-sub.json').mtime
        },
        {
            name: 'Menu',
            size: fileInfo(STATIC_DIR + 'menu.json').size,
            lastModified: fileInfo(STATIC_DIR + 'menu.json').mtime
        },
        {
            name: 'Newsletter',
            size: fileInfo(STATIC_DIR + 'newsletter.json').size,
            lastModified: fileInfo(STATIC_DIR + 'newsletter.json').mtime
        },
        {
            name: 'OfferProduct',
            size: fileInfo(STATIC_DIR + 'offer-product.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-product.json').mtime
        },
        {
            name: 'OfferSlide',
            size: fileInfo(STATIC_DIR + 'offer-slide.json').size,
            lastModified: fileInfo(STATIC_DIR + 'offer-slide.json').mtime
        },
        {
            name: 'Order',
            size: fileInfo(STATIC_DIR + 'order.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order.json').mtime
        },
        {
            name: 'OrderPaymentInfo',
            size: fileInfo(STATIC_DIR + 'order-payment-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order-payment-info.json').mtime
        },
        {
            name: 'OrderTemporary',
            size: fileInfo(STATIC_DIR + 'order-temporary.json').size,
            lastModified: fileInfo(STATIC_DIR + 'order-temporary.json').mtime
        },
        {
            name: 'PageInfo',
            size: fileInfo(STATIC_DIR + 'page-info.json').size,
            lastModified: fileInfo(STATIC_DIR + 'page-info.json').mtime
        },
        {
            name: 'PriceExtraData',
            size: fileInfo(STATIC_DIR + 'price-extra-data.json').size,
            lastModified: fileInfo(STATIC_DIR + 'price-extra-data.json').mtime
        },
        {
            name: 'Publisher',
            size: fileInfo(STATIC_DIR + 'publisher.json').size,
            lastModified: fileInfo(STATIC_DIR + 'publisher.json').mtime
        },
        {
            name: 'PublisherFilter',
            size: fileInfo(STATIC_DIR + 'publisher-filter.json').size,
            lastModified: fileInfo(STATIC_DIR + 'publisher-filter.json').mtime
        },
        {
            name: 'Review',
            size: fileInfo(STATIC_DIR + 'review.json').size,
            lastModified: fileInfo(STATIC_DIR + 'review.json').mtime
        },
        {
            name: 'ReviewControl',
            size: fileInfo(STATIC_DIR + 'review-control.json').size,
            lastModified: fileInfo(STATIC_DIR + 'review-control.json').mtime
        },
        {
            name: 'Reward',
            size: fileInfo(STATIC_DIR + 'reward.json').size,
            lastModified: fileInfo(STATIC_DIR + 'reward.json').mtime
        },
        {
            name: 'SaleTag',
            size: fileInfo(STATIC_DIR + 'sale-tag.json').size,
            lastModified: fileInfo(STATIC_DIR + 'sale-tag.json').mtime
        },
        {
            name: 'SideMenu',
            size: fileInfo(STATIC_DIR + 'side-menu.json').size,
            lastModified: fileInfo(STATIC_DIR + 'side-menu.json').mtime
        },
        {
            name: 'SubCategory',
            size: fileInfo(STATIC_DIR + 'sub-category.json').size,
            lastModified: fileInfo(STATIC_DIR + 'sub-category.json').mtime
        },
        {
            name: 'SubCategoryFilter',
            size: fileInfo(STATIC_DIR + 'sub-category-filter.json').size,
            lastModified: fileInfo(STATIC_DIR + 'sub-category-filter.json').mtime
        },
        {
            name: 'Tag',
            size: fileInfo(STATIC_DIR + 'tag.json').size,
            lastModified: fileInfo(STATIC_DIR + 'tag.json').mtime
        },
        {
            name: 'User',
            size: fileInfo(STATIC_DIR + 'user.json').size,
            lastModified: fileInfo(STATIC_DIR + 'user.json').mtime
        },
        {
            name: 'UniqueId',
            size: fileInfo(STATIC_DIR + 'unique-id.json').size,
            lastModified: fileInfo(STATIC_DIR + 'unique-id.json').mtime
        },
        {
            name: 'Wishlist',
            size: fileInfo(STATIC_DIR + 'wishlist.json').size,
            lastModified: fileInfo(STATIC_DIR + 'wishlist.json').mtime
        },
        {
            name: 'Role',
            size: fileInfo(STATIC_DIR + 'role.json').size,
            lastModified: fileInfo(STATIC_DIR + 'role.json').mtime
        }
    ];
}


function fileInfo (path) {
    if (fs.existsSync(path)) {
        const { size, mtime, ctime } = fs.statSync(path)
        return {mtime, size, ctime}
    } else {
        return {mtime: null, size: null, ctime: null}
    }
}

function downloadUrl(req, path, fileName) {
    if (fs.existsSync(path)) {
        const baseurl = req.protocol + `${process.env.PRODUCTION_BUILD === 'true' ? 's://' : '://'}` + req.get("host");
        return baseurl + STATIC_DIR_PATH + fileName;
    } else {
        return null;
    }
}




