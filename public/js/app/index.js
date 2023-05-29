// @ts-check
/// <reference path="../modules.d.ts" />

import { $ } from 'https://adriancraft07.github.io/js-lib/$.js';
import { createElementDom } from 'https://adriancraft07.github.io/js-lib/dom.js';
import { makeLink } from 'https://adriancraft07.github.io/js-lib/SPA.js';
import { createNotification } from '../lib/notification.js';
import { getCredentials } from './credentials.js';

const HOST = location.host;

/**
 * @type {[NaN, import('../types').Server['id'], import('../types').ID]}
 */
// @ts-ignore
const [_, server, channel] = location.href
	.replace(location.origin, '')
	.split('/')
	.filter(Boolean)
	.map(d => (d === '@me' ? d : Number(d)));
const data = {
	server,
	channel,
	users: {},
};
function setData(server, channel) {
	if (server && data.server != server) {
		data.server = server;
	}
	data.channel = channel;
}

let members = [];

/**
 * @returns {Promise<import('../types').IO>}
 */
function io() {
	return new Promise(async (resolve, reject) => {
		const socket = new WebSocket(`ws://${HOST}`);
		const events = new Map();
		socket.onmessage = event => {
			const data = JSON.parse(event.data);
			if (events.has(data.event)) {
				events.get(data.event).forEach(fn => fn(...data.args));
			}
		};
		socket.onopen = () => {
			resolve({
				// @ts-ignore
				user: null,
				on(event, callback) {
					if (!events.has(event)) {
						events.set(event, new Set());
					}
					events.get(event).add(callback);
				},
				emit(event, ...args) {
					socket.send(JSON.stringify({ event, args }));
				},
				iemit(event, ...args) {
					if (events.has(event)) events.get(event).forEach(fn => fn(...args));
				},
			});
		};
	});
}
/**
 * @param {import("../types").User} user
 */
function openUser(user) {
	let $user = $('#user-info-container');
	$user.html('');
	let bg = createElementDom('div', { id: 'background-user' });
	let img = createElementDom('img', { src: user.avatar, class: ['author', 'user-info'] });
	let info = createElementDom(
		'div',
		{ id: 'user-info' },
		createElementDom('h2', { class: 'name' }, user.name),
		createElementDom('p', { class: 'name-descriminator' }, `${user.name}#${user.discriminator}`),
		createElementDom('div', { class: 'line' }),
		createElementDom('h4', { class: 'title-info' }, 'ID'),
		createElementDom('p', { class: 'data-info' }, user.id)
	);
	setTimeout(() => {
		$user.append(bg);
		$user.append(img);
		$user.append(info);
	}, 50);
}
/** @param {import('../types').Message} message */
function toMessage(message) {
	if (message.data.content) return message.data.content;
	const embed = message.data.embeds[0];
	if (embed) return embed.title || embed.description;
	return 'New Message';
}
function noSetDataMessage(message = '') {
	const mentions = message.replace(/(<@(.+?)>)/g, function (...args) {
		let [match, _, ...Args] = args;
		let [str, pos, ...$$] = Args.reverse();
		let $ = ['', ...$$.reverse()];
		let user = members.find(member => member.id == $[1]);

		return user ? `@${user.name}` : '@deleted-user';
	});
	return mentions;
}
function setDataMessage(message = '') {
	const urls = message.split(' ').map(data => {
		if (/http[s]?:\/\/.{1,}(([.].*){1,} | (:[0-9]{1,}))([\/].*)*/g.test(data))
			return data.replace(/http[s]?:\/\/[.]{1,}([.].*){1,}([\/].*)*/g, match => {
				createElementDom('a', { href: match, class: ['user'] }, match);
				return '';
			});
		return data;
	});
	let data = [];

	urls.map(value => {
		if (typeof value == 'string') {
			let mentions = [];
			value = ' ' + value;
			let a = value
				.replace(/(<@(.+?)>)/g, function (...args) {
					let [match, _, ...Args] = args;
					let [str, pos, ...$$] = Args.reverse();
					let $ = ['', ...$$.reverse()];
					let user = members.find(member => member.id == $[1]);

					mentions.push(
						createElementDom(
							'a',
							{
								class: ['user'],
								onclick() {
									openUser(user);
								},
							},
							user ? `@${user.name}` : '@deleted-user'
						)
					);

					return '\x00';
				})
				.split('\x00');
			a.forEach((value, i) => {
				data.push(value);
				if (mentions[i]) data.push(mentions[i]);
			});
		} else data.push(value);
	});
	return data;
}
function noStyleMessage(message) {
	return noSetDataMessage(message)
		.replace(/[*]{2}(.+?)[*]{2}/g, '$1')
		.replace(/[*]{1}(.+?)[*]{1}/g, '$1');
}
function styleMessage(message) {
	let data = [];
	setDataMessage(message).forEach(value => {
		if (typeof value == 'string') {
			/**
			 * @type {{x00: Array<HTMLElement>, x01: Array<HTMLElement>, x02: Array<HTMLElement>}}
			 */
			let special = { x00: [], x01: [], x02: [] };
			value
				.replace(/[*]{3}(.+?)[*]{3}/g, (...args) => {
					let [match, _, ...Args] = args;
					let [str, pos, ...$$] = Args.reverse();
					let $ = ['', ...$$.reverse()];

					special.x02.push(createElementDom('strong', null, createElementDom('i', null, $[1])));
					return '\x02';
				})
				.replace(/[*]{2}(.+?)[*]{2}/g, (...args) => {
					let [match, _, ...Args] = args;
					let [str, pos, ...$$] = Args.reverse();
					let $ = ['', ...$$.reverse()];

					special.x01.push(createElementDom('strong', null, ...styleMessage($[1])));
					return '\x01';
				})
				.replace(/[*]{1}(.+?)[*]{1}/g, (...args) => {
					let [match, _, ...Args] = args;
					let [str, pos, ...$$] = Args.reverse();
					let $ = ['', ...$$.reverse()];

					special.x00.push(createElementDom('i', null, ...styleMessage($[1])));
					return '\x00';
				})
				.split('\x00')
				.map((value0, i) => {
					value0.split('\x01').map((value1, j) => {
						value1.split('\x02').map((value2, k) => {
							data.push(value2);
							if (special.x02[k]) data.push(special.x02[k]);
						});
						if (special.x01[j]) data.push(special.x01[j]);
					});
					if (special.x00[i]) data.push(special.x00[i]);
				});
		} else data.push(value);
	});
	return data;
}
/**
 * @param {import("../types").Message} message
 */
function messageToHTML(message) {
	let regExp = new RegExp(`<@${localStorage.ID}>`, 'g');
	let extraData = '';
	let data;
	if (message.data.content) {
		if (regExp.test(message.data.content)) extraData = 'mention';
		data = createElementDom('p', null, ...styleMessage(message.data.content));
	}
	if (message.data.embeds[0]) {
		message.data.embeds.forEach(embed => {
			if (regExp.test(embed.title) || regExp.test(embed.description)) extraData = 'mention';
			let title = embed.title ? createElementDom('p', { class: ['embed', 'title'] }, ...styleMessage(embed.title)) : '';
			let description = embed.description ? createElementDom('p', { class: ['embed', 'description'] }, ...styleMessage(embed.description)) : '';
			data = createElementDom('div', { class: ['embed'] }, title, description);
		});
	}
	return createElementDom('div', { class: ['message', extraData] }, data);
}
/**
 * @param {import('../types').User} author
 * @param {import("../types").Message} message
 */
function showMessage(author, message) {
	let img = createElementDom('img', {
		src: author.avatar,
		class: ['author'],
		onclick() {
			openUser(author);
		},
	});
	let bot;
	if (author.bot)
		bot = createElementDom('img', {
			src: author.verified ? '/attachments/BOT-VERIFIED' : '/attachments/BOT',
			class: ['bot'],
		});
	let userName = createElementDom(
		'div',
		{
			class: ['userName'],
			onclick() {
				openUser(author);
			},
		},
		createElementDom('p', null, author.name, bot)
	);
	let messageHTML = messageToHTML(message);
	let data = createElementDom('div', { class: ['data'] }, userName, messageHTML);
	let $message = [...document.querySelectorAll('.message-handler')].reverse()[0];
	// @ts-ignore
	if ($message && $message.attributes.author.nodeValue == author.id && !$message.children[1].children[10]) {
		$message.children[1].appendChild(messageHTML);
	} else {
		let newMessageHTML = createElementDom('div', { class: ['message-handler'], author: author.id }, img, data);
		$('div#messages').append(newMessageHTML);
	}
	const messages = $('div#messages');
	messages.forEach(msg => msg.scroll.bottom(0));
}

/**
 * @param {import("../types").User} user
 */
function myData(user) {
	let $data = $('div#mydata');
	let img = createElementDom('img', { src: user.avatar, class: ['author'] });
	let name = createElementDom('p', null, user.name);
	$data.append(img);
	$data.append(name);
}
function log(l) {
	console.log(l);
	return l;
}
function clearChat() {
	$('#messages').html('');
}

window.addEventListener('load', async () => {
	let notInfoContainer = () => {
		$('#user-info-container').html('');
	};
	$('#servers').on('click', notInfoContainer);
	$('#channels').on('click', notInfoContainer);
	$('#messages').on('click', notInfoContainer);
	$('#input').on('click', notInfoContainer);
	const socket = await io();
	socket.on('connected', user => {
		socket.user = user;
		myData(user);
	});
	// @ts-ignore
	socket.emit('login', getCredentials()?.credentials);

	await fetch('/api/servers', {
		method: 'POST',
		body: JSON.stringify(getCredentials()),
	})
		.catch(r => r)
		.then(r => r.json())
		.then(_servers => {
			const servers = _servers;
			clearChat();
			let $servers = $('div#servers');
			$servers?.html('');

			servers.forEach(async server => {
				const $server = await loadServer(server);
				$servers.append($server);
			});

			let $server = createElementDom(
				'div',
				{ class: ['server'] },
				createElementDom(
					'a',
					null,
					createElementDom('img', {
						src: '/images/Add-Server',
						class: ['author'],
						onclick() {
							let $data = $('#data');
							let $screen = $('#extra-screen');
							$data.css('display', 'none');
							/**
							 * @type {HTMLInputElement}
							 */
							// @ts-ignore
							let $name_server = createElementDom('input', { type: 'text', id: 'server' });
							let $sendButton = createElementDom(
								'button',
								{
									id: 'server',
									onclick() {
										socket.emit(
											'new-server',
											$name_server.value,
											// @ts-ignore
											'/images/Server-Default'
										);
										$data.css('display', 'block');
										$screen.html('');
									},
								},
								'crear'
							);
							$screen.append($name_server);
							$screen.append($sendButton);
						},
					})
				)
			);
			$servers.append($server);
		});
	socket.on('members', users => {
		let $members = $('div#members');
		$members.html('');
		users
			.sort((a, b) => {
				if (a.active == true && b.active == false) return -1;
				else if (a.active == false && b.active == true) return 1;
				let v = a.name.localeCompare(b.name);
				if (v == 0) return Number(a.discriminator) - Number(b.discriminator);
				return v;
			})
			.forEach(user => {
				let $member = createElementDom(
					'div',
					{
						class: ['member'],
						onclick() {
							openUser(user);
						},
					},
					createElementDom('img', { src: user.avatar, class: ['author', `active-${user.active}`] }),
					createElementDom('p', null, user.name)
				);
				$members.append($member);
			});
	});

	socket.on('message', (serverId, channelId, message) => {
		const author = data.users[message.author];
		createNotification({
			text: toMessage(message),
			author,
			onclick() {
				location.href = `/channel/${serverId}/${channelId}`;
			},
		});
		if (channelId === channel) showMessage(author, message);
	});
	socket.on('add-server', async server => {
		const $server = await loadServer(server);
		$('div#servers').append($server);
	});
	/**
	 * @param {import('../types').Server} server
	 */
	async function loadServer(server) {
		const firstChannel = server.categories[0].channels[0];
		let $server = createElementDom(
			'div',
			{ class: ['server'] },
			createElementDom(
				makeLink(() => {
					setData(server.id, firstChannel.id);
					loadServer(server);
					loadChannel(firstChannel, server);
				}),
				{ to: `/channel/${server.id}/${firstChannel.id}` },
				createElementDom('img', { src: server.icon || '/attachments/Server-icon', class: ['author'] })
			)
		);
		if (server.id == data.server) {
			if(server.id == '@me') document.title = `AgaScord | ${server.name}`
			for (const member of server.members) {
				if (data.users[member.id]) continue;
				data.users[member.id] = await fetch(`/api/public/user/${member.id}`, {
					method: 'POST',
					body: JSON.stringify(getCredentials()),
				})
					.catch(r => r)
					.then(r => r.json());
			}
			socket.emit('get-members', server.id);
			server.categories.forEach(category => {
				let $category = createElementDom(
					'div',
					{ class: ['category'] },
					createElementDom('p', null, category.name),
					...category.channels.map(channel => {
						return createElementDom(
							'div',
							{ class: ['channel'] },

							createElementDom(
								makeLink(() => {
									setData(server.id, channel.id);loadChannel(channel, server)}),
								{ to: `/channel/${server.id}/${channel.id}` },
								createElementDom('p', null, channel.name)
							)
						);
					})
				);
				const $channels = $('div#channels');
				$channels.html('');
				$channels.append($category);
			});
			loadChannel(firstChannel, server)
		}
		return $server;
	}
	/**
	 * @param {import("../types").Channel} channel
	 * @param {import("../types").Server} server
	 */
	function loadChannel(channel, server) {
		if(server.name === '@me') document.title = `AgaScord | ${channel.name}`
		document.title = `AgaScord | ${channel.name} | ${server.name}`
		clearChat();
		$('div#messages').append(createElementDom('h1', {id:'channel-name'}, channel.name));
		channel.messages.forEach(message => showMessage(data.users[message.author], message));
	}
	function send(input = document.querySelector('input')) {
		if (!input) return;
		/** @type {import('../types').MessageSend} */
		const message = {
			author: socket.user.id,
			data: {
				content: input.value,
			},
			reply: null,
		};
		// @ts-ignore
		socket.emit('message', server, channel, message);
		input.value = '';
	}
	document.addEventListener('keydown', tecla => {
		if (!tecla.ctrlKey && tecla.key == 'Enter') send();
		else if (tecla.ctrlKey && tecla.key == 'Enter') $('input').value.push('\n');
	});
});
