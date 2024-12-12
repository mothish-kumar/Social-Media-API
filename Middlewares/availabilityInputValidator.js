import {check,validationResult} from 'express-validator'

export const validateUserNameAvailability = [

    check('userName')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

]

export const validatePhoneNumberAvailability = [
    
    check('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .matches(/^\+?[1-9]\d{1,3}\d{10}$/).withMessage('Invalid Phone Number format'),
]

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};