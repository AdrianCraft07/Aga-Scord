interface Error {
	DISCRIMINATOR_NOT_FOUND: { error: 'DISCRIMINATOR_NOT_FOUND'; message: 'Discriminator not found'; errorCode: 1 };
	CREDENTIALS_NOT_FOUND: { error: 'CREDENTIALS_NOT_FOUND'; message: 'Credentials not found'; errorCode: 2 };
	USER_NOT_FOUND: { error: 'USER_NOT_FOUND'; message: 'User not found'; errorCode: 3 };
	MESSAGE_NOT_FOUND: { error: 'MESSAGE_NOT_FOUND'; message: 'Message not found'; errorCode: 4 };
	SERVER_NOT_FOUND: { error: 'SERVER_NOT_FOUND'; message: 'Server not found'; errorCode: 5 };
	CHANNEL_NOT_FOUND: { error: 'CHANNEL_NOT_FOUND'; message: 'Channel not found'; errorCode: 6 };
	CREDENTIALS_NOT_DETECTED: { error: 'CREDENTIALS_NOT_DETECTED'; message: 'Credentials not detected'; errorCode: 7 };
	USER_NOT_DETECTED: { error: 'USER_NOT_DETECTED'; message: 'User not detected'; errorCode: 8 };
	INVALID_PARSE_BODY: { error: 'INVALID_PARSE_BODY'; message: 'Invalid parse body'; errorCode: 9 };
	BOT_NOT_FOUND: { error: 'BOT_NOT_FOUND'; message: 'Bot not found'; errorCode: 10 };
	PERSON_NOT_FOUND: { error: 'PERSON_NOT_FOUND'; message: 'Person not found'; errorCode: 11 };
	CATEGORY_NOT_FOUND: { error: 'CATEGORY_NOT_FOUND'; message: 'Category not found'; errorCode: 12 };
}
export type InternalError = Error[keyof Error];
type ErrorFromCode<T extends InternalError['errorCode']> = {
	[errorCode in T]: Extract<InternalError, { errorCode: T }>;
};
type ErrorFromMessage<T extends InternalError['message']> = {
	[message in T]: Extract<InternalError, { message: T }>;
};
type ErrorFromError<T extends InternalError['error']> = {
	[error in T]: Extract<InternalError, { error: T }>;
};
type InternalErrors<T extends InternalError['error']> = {
	[error in T]: Extract<InternalError, { error: error }>;
} & {
	ErrorFromCode: ErrorFromCode<InternalError['errorCode']>;
	ErrorFromMessage: ErrorFromMessage<InternalError['message']>;
	Error: ErrorFromError<InternalError['error']>;
};

const InternalErrors = { ErrorFromCode: {}, ErrorFromMessage: {}, Error: {} } as InternalErrors<InternalError['error']>;
[
	'',
	'Discriminator not found',
	'Credentials not found',
	'User not found',
	'Message not found',
	'Server not found',
	'Channel not found',
	'Credentials not detected',
	'User not detected',
	'Invalid parse body',
	'Bot not found',
	'Person not found',
	'Category not found',
].forEach((message, errorCode) => {
	if (!message) return;
	const Error = {
		error: message.toUpperCase().replace(/ /g, '_'),
		message,
		errorCode,
	};
	InternalErrors.ErrorFromCode[errorCode] = Error;
	InternalErrors.ErrorFromMessage[message] = Error;
	InternalErrors.Error[message] = Error;
	InternalErrors[Error.error] = Error;
});

export default InternalErrors;