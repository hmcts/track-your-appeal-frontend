const {expect} = require('test/chai-sinon');
const {events} = require('app/core/events');
const {cloneDeep} = require('lodash');
const content = require('app/assets/locale/en').progressBar.screenReader;
const screenReaderHelper = require('app/core/ScreenReaderHelper');

describe('ScreenReaderHelper.js', () => {

  describe('the function classifiedAsAppealReceived()', ()=> {

    it('should return true when the current status is APPEAL_RECEIVED', () => {
      expect(screenReaderHelper.classifiedAsAppealReceived(events.APPEAL_RECEIVED.name)).to.eq(true);
    });

    it('should return true when the current status is DWP_RESPOND_OVERDUE', () => {
      expect(screenReaderHelper.classifiedAsAppealReceived(events.DWP_RESPOND_OVERDUE.name)).to.eq(true);
    });

    it('should return false when encountering any event that is not APPEAL_RECEIVED or DWP_RESPOND_OVERDUE', () => {

      const clonedEvents = cloneDeep(events);
      delete clonedEvents['APPEAL_RECEIVED'];
      delete clonedEvents['DWP_RESPOND_OVERDUE'];

      for (const event in clonedEvents) {
        if (clonedEvents.hasOwnProperty(event)) {
          expect(screenReaderHelper.classifiedAsAppealReceived(event)).to.eq(false);
        }
      }

    });

  });

  describe('the function classifiedAsDWPRespond()', ()=> {

    it('should return true when the current status is ADJOURNED', () => {
      expect(screenReaderHelper.classifiedAsDWPRespond(events.ADJOURNED.name)).to.eq(true);
    });

    it('should return true when the current status is DWP_RESPOND', () => {
      expect(screenReaderHelper.classifiedAsDWPRespond(events.DWP_RESPOND.name)).to.eq(true);
    });

    it('should return true when the current status is PAST_HEARING_BOOKED', () => {
      expect(screenReaderHelper.classifiedAsDWPRespond(events.PAST_HEARING_BOOKED.name)).to.eq(true);
    });

    it('should return true when the current status is POSTPONED', () => {
      expect(screenReaderHelper.classifiedAsDWPRespond(events.POSTPONED.name)).to.eq(true);
    });

    it('should return false when encountering any event that is not ADJOURNED, DWP_RESPOND, PAST_HEARING_BOOKED or POSTPONED', () => {

      const clonedEvents = cloneDeep(events);
      delete clonedEvents['ADJOURNED'];
      delete clonedEvents['DWP_RESPOND'];
      delete clonedEvents['PAST_HEARING_BOOKED'];
      delete clonedEvents['POSTPONED'];

      for (const event in clonedEvents) {
        if (clonedEvents.hasOwnProperty(event)) {
          expect(screenReaderHelper.classifiedAsDWPRespond(event)).to.eq(false);
        }
      }

    });

  });

  describe('the function classifiedAsHearingBooked()', ()=> {

    it('should return true when the current status is HEARING_BOOKED', () => {
      expect(screenReaderHelper.classifiedAsHearingBooked(events.HEARING_BOOKED.name)).to.eq(true);
    });

    it('should return true when the current status is NEW_HEARING_BOOKED', () => {
      expect(screenReaderHelper.classifiedAsHearingBooked(events.NEW_HEARING_BOOKED.name)).to.eq(true);
    });

    it('should return false when encountering any event that is not HEARING_BOOKED or NEW_HEARING_BOOKED', () => {

      const clonedEvents = cloneDeep(events);
      delete clonedEvents['HEARING_BOOKED'];
      delete clonedEvents['NEW_HEARING_BOOKED'];

      for (const event in clonedEvents) {
        if (clonedEvents.hasOwnProperty(event)) {
          expect(screenReaderHelper.classifiedAsHearingBooked(event)).to.eq(false);
        }
      }

    });

  });

  describe('the function getScreenReaderTextFor', ()=> {

    describe('the screen reader text, at each progress bar tick, when the status is set to APPEAL_RECEIVED', ()=> {

      const currentStatus = events.APPEAL_RECEIVED.name;

      it('should get the text when the progress bar tick is at Appeal Received', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.APPEAL_RECEIVED.name)).to.eq(content.appeal.happened);
      });

      it('should get the text when the progress bar tick is at DWP respond', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.DWP_RESPOND.name)).to.eq(content.dwpRespond.due);
      });

      it('should get the text when the progress bar tick is at Hearing booked', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING_BOOKED.name)).to.eq(content.hearingBooked.due);
      });

      it('should get the text when the progress bar tick is at Hearing', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING.name)).to.eq(content.hearing.due);
      });

    });

    describe('the screen reader text, at each progress bar tick, when the status is set to DWP_RESPOND', ()=> {

      const currentStatus = events.DWP_RESPOND.name;

      it('should get the text when the progress bar tick is at Appeal Received', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.APPEAL_RECEIVED.name)).to.eq(content.appeal.happened);
      });

      it('should get the text when the progress bar tick is at DWP respond', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.DWP_RESPOND.name)).to.eq(content.dwpRespond.happened);
      });

      it('should get the text when the progress bar tick is at Hearing booked', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING_BOOKED.name)).to.eq(content.hearingBooked.due);
      });

      it('should get the text when the progress bar tick is at Hearing', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING.name)).to.eq(content.hearing.due);
      });

    });

    describe('the screen reader text, at each progress bar tick, when the status is set to HEARING_BOOKED', ()=> {

      const currentStatus = events.HEARING_BOOKED.name;

      it('should get the text when the progress bar tick is at Appeal Received', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.APPEAL_RECEIVED.name)).to.eq(content.appeal.happened);
      });

      it('should get the text when the progress bar tick is at DWP respond', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.DWP_RESPOND.name)).to.eq(content.dwpRespond.happened);
      });

      it('should get the text when the progress bar tick is at Hearing booked', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING_BOOKED.name)).to.eq(content.hearingBooked.happened);
      });

      it('should get the text when the progress bar tick is at Hearing', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING.name)).to.eq(content.hearing.due);
      });

    });

    describe('the screen reader text, at each progress bar tick, when the status is set to HEARING', ()=> {

      const currentStatus = events.HEARING.name;

      it('should get the text when the progress bar tick is at Appeal Received', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.APPEAL_RECEIVED.name)).to.eq(content.appeal.happened);
      });

      it('should get the text when the progress bar tick is at DWP respond', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.DWP_RESPOND.name)).to.eq(content.dwpRespond.happened);
      });

      it('should get the text when the progress bar tick is at Hearing booked', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING_BOOKED.name)).to.eq(content.hearingBooked.happened);
      });

      it('should get the text when the progress bar tick is at Hearing', () => {
        expect(screenReaderHelper.getScreenReaderTextFor(currentStatus, events.HEARING.name)).to.eq(content.hearing.happened);
      });

    });

  });

});
