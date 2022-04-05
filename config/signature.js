
const glyph = '~~_/)~~';
// const name = '<br/><span style="font-family: Arial; color: #436663; font-size: 1.75em">Capt. David Martin</span>';
const name = '<img src="cid:dave-signature"/>'
const email = '<a href="mailto:dave@uksailmakers-ne.com">dave@uksailmakers-ne.com</a>';
const phone = '646-483-5898';
const site = '<a href="www.uksailmakers-ne.com">www.uksailmakers-ne.com</a>';
const embedded = '<img src="cid:dave@uk-sailmakers-ne.com"/>'

signature = `${glyph}<br/>${name}<br/>${email}<br/>${phone}<br/>${site}<br/><br/>${embedded}`;

module.exports = signature;
