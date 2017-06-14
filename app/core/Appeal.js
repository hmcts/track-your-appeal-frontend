const {get,startsWith} = require('lodash');
const {contentSubKeys} = require('app/config');
const {events} = require('app/core/events');
const locale = require('app/assets/locale/en');
const NunjucksUtils = require('app/core/NunjucksUtils');
const ADDRESS_LINE = 'addressLine';

class Appeal {

  constructor(appeal) {
    this.caseReference = appeal.caseReference;
    this.appealNumber = appeal.appealNumber;
    this.name = appeal.name;
    this.status = appeal.status;
    this.latestEvents = appeal.latestEvents || [];
    this.historicalEvents = appeal.historicalEvents || [];
  }

  decorate() {
    this.setHeadingAndRenderedContentOnEvents(this.latestEvents);
    this.setHeadingAndRenderedContentOnEvents(this.historicalEvents);
    this.reformatHearingDetails(this.latestEvents);
    this.reformatHearingDetails(this.historicalEvents);
    this.setLatestHearingBookedEventOnAppeal();
  }

  setHeadingAndRenderedContentOnEvents(events) {
    events.forEach(event => {
      this.setHeadingOnEvent(event);
      this.setRenderedContentOnEvent(event);
    });
  }

  setLatestHearingBookedEventOnAppeal() {
    if(this.status === events.HEARING_BOOKED.name) {
      this.latestHearingBookedEvent = this.getFirstEventWithMatchingContentKey(
        this.latestEvents, events.HEARING_BOOKED.contentKey);
    }

    if(this.status === events.HEARING.name) {
      this.latestHearingBookedEvent = this.getFirstEventWithMatchingContentKey(
        this.historicalEvents, events.HEARING_BOOKED.contentKey);
    }
  }

  reformatHearingDetails(evnts) {
    evnts = evnts || [];
    evnts.forEach(event => {
      if(event.type === events.HEARING_BOOKED.name && event.placeholder) {
        event.hearingAddress = {};
        event.hearingAddress.lines = [];
        if(event.placeholder.venueName) {
          event.hearingAddress.lines.push(event.placeholder.venueName);
        }
        for (const property in event.placeholder) {
          if (startsWith(property, ADDRESS_LINE) && event.placeholder[property].trim()) {
            event.hearingAddress.lines.push(event.placeholder[property]);
          }
        }
        event.hearingAddress.lines.push(event.placeholder.postcode);
      }
    });
  }

  getFirstEventWithMatchingContentKey(events, contentKey) {
    return events.filter(event => {
      return event.contentKey === contentKey;
    })[0];
  }

  setHeadingOnEvent(event) {
    event.heading = this.getContent(event.contentKey + contentSubKeys.HEADING);
  }

  setRenderedContentOnEvent(event) {
    let content = this.getContent(event.contentKey + contentSubKeys.CONTENT);
    if (typeof content === 'string') {
      content = [content];
    }

    if(event.type === events.EVIDENCE_RECEIVED.name || event.type === events.HEARING.name) {
      event.placeholder.date = event.date;
    }

    event.renderedContent = this.getRenderedContent(content, event.placeholder);
  }

  getContent(contentKey) {
    let content = get(locale, contentKey);
    if (!content) {
      throw new Error('Unknown content key: ' + contentKey);
    }
    return content;
  }

  getRenderedContent(content, placeholder) {
    return content.map((str) => {
      return NunjucksUtils.renderString(str, placeholder);
    });
  }
}

module.exports = Appeal;