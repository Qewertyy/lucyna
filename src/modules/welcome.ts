import { InlineKeyboard } from "grammy";
import bot from "../bot";
import constants from "../config";
import { channel_log } from "../logger";

// when the bot is added to a chat
const added_to_chat_text = "Thank you for adding me to the group!\n\nExplore my functionalities by using the button below.";
const help_inlinekeyboard = new InlineKeyboard()
    .url("Usage Guide", `https://telegram.me/${constants.BOT_USERNAME}?start=help_me_im_dumb`)

bot.on("message:new_chat_members:me", async (ctx: any) => {
    let currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    let log_message = (
        `\#ADDED on ${currentTime}, ${new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}\n\n` +
        `• Chat Title: <b>${ctx.chat?.title}</b>\n` +
        `• Chat Type: <code>${ctx.chat?.type}</code>\n` +
        `• Chat ID: <code>${ctx.chat?.id}</code>\n` +
        `• Chat Members: <code>${await ctx.api.getChatMemberCount(ctx.chat?.id)}</code>\n` +
        `• Invited By: <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>\n` 
    );
    if (ctx.chat.type != "undefined" && ctx.chat.username != undefined) {
        log_message += `• Invite Link: <a href="https://telegram.me/${ctx.chat.username}">${ctx.chat.username}</a>\n` 
        log_message += `• Service Message: <a href="https://telegram.me/${ctx.chat.username}/${ctx.message.message_id}">${ctx.message.message_id}</a>`
    }
    else {
        log_message += `• Invite Link: <code>(group is private)</code>` 
    }
    await ctx.api.sendAnimation(ctx.chat.id, constants.ADDED_TO_CHAT_GIF, {caption: added_to_chat_text, reply_markup: help_inlinekeyboard, parse_mode: "HTML"});
    channel_log(log_message)  
});

// when a new member joins the chat
bot.on("message:new_chat_members", async (ctx: any) => {
    await ctx.reply(`Welcome new member ${ctx.from?.first_name}`, {reply_parameters: {message_id: ctx.message.message_id}})
});