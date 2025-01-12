const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const secretKey = '6Lcm544qAAAAAF7mRgJNCDmCynUlyq21IjPX5czf';
    const { token } = JSON.parse(event.body);

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
    method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Human verified' })
    };
    } else {
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Human verification failed' })
    };
    }
};
