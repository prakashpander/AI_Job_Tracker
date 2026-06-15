const sendToken = (user, message, res, statusCode) => {
    let token = user.generateAuthToken();

    res.status(statusCode).cookie("userToken", token, {
        expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true
    }).json({
        success : true,
        message : message,
        token : token,
        user
    })

}
export default sendToken;