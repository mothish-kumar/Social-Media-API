import {check,validationResult} from 'express-validator'

export const validateRegistration = [

    check('userName')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    check('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .matches(/^\+?[1-9]\d{1,3}\d{10}$/).withMessage('Invalid Phone Number format'),

    check('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({min:8}).withMessage('Password must be at least 8 characters long'),

    check('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .matches(/^\+?[1-9]\d{1,3}\d{10}$/).withMessage('Invalid Phone Number format (must include country code)'),

    check('dateOfBirth')
    .notEmpty().withMessage('Date of Birth is required')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Invalid Date of Birth format (expected YYYY-MM-DD)')
    .custom((value) => {
        const currentDate = new Date();
        const dob = new Date(value);
        const age = currentDate.getFullYear() - dob.getFullYear();
        const monthDifference = currentDate.getMonth() - dob.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 18) {
            throw new Error('You must be at least 18 years old');
        }
        return true;
    })

    

]

export const validateLogin = [

    check('userName')
    .trim()
    .notEmpty().withMessage('Username is required'),

    check('password')
    .trim()
    .notEmpty().withMessage('Password is required')

]

export const validateForgotPassword = [
    check('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid Phone Number format (must include country code)')
]

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};