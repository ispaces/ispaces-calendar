//Ispaces.CalendarApplication = function(config) {
//Ispaces['CalendarApplication'] = function(config) {
Ispaces.CalendarApplication = Ispaces['CalendarApplication'] = function(config) {
    console.log('Ispaces.CalendarApplication('+config+')');

    //*
    if (arguments.length) {
        for(var i = 0; i < arguments.length; i++) {
            Ispaces.log.debug('    arguments['+i+'] = '+arguments[i]);
            if (Ispaces.Common.isObject(arguments[i])) {
                for (var p in arguments[i]) { Ispaces.log.debug('    arguments['+i+'][' + p + '] = ' + arguments[i][p]) }
            }
        }
    }
    //*/

    let thisApplication = this;
    Ispaces.Application.apply(thisApplication, arguments); // call the super constructor - Ispaces.Application
    thisApplication.configure(config);
    if (Ispaces.userInterface) Ispaces.userInterface.setTheme(thisApplication.classId); // CSS Stylesheet
};

Ispaces.Common.extendClass(Ispaces.CalendarApplication, Ispaces.Application);

/*
 * https://stackoverflow.com/questions/22847070/instagram-api-from-client-side
 * https://stackoverflow.com/questions/31505596/instagram-jquery-ajax-type-get-cant-get-around-cors
 * https://stackoverflow.com/questions/39679299/cors-error-when-i-use-instagram-api-with-angularjs
 *
 * https://www.ibm.com/developerworks/library/wa-aj-jsonp1/
 * https://www.sitepoint.com/jsonp-examples/
 * http://schock.net/articles/2013/02/05/how-jsonp-really-works-examples/
 *
 * https://github.com/euribe98/instagramapi/blob/master/instagramapiv2.js
 */

Ispaces.Common.extend(Ispaces.CalendarApplication.prototype, {
      classId: 'CalendarApplication'
    , simpleName: 'CalendarApplication'
    , appName: 'Calendar'
    , title : 'Calendar'
    , WidthHeight: [888, 480]
    //*String*/ , ICON_IMG : Ispaces.Constants.Paths.IMAGES+'test/cal.gif'
    /*Array*/  , MONTHS : ['January','February','March','April','May','June','July','August','September','October','November','December']
    /*Array*/  , MONTHS_ABBR : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    /*Array*/  , DAYS : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    /*Array*/  , DAYS_ABBR : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    /*Array*/  , DAYS_CHAR : ['S','M','T','W','T','F','S']
    /*Array*/  , DAYS_IN_MONTH : [31,28,31,30,31,30,31,31,30,31,30,31]
    /*Date*/   , now : new Date()
    /*int*/    , heightDayHeader : 28
    /*boolean*/ ,showingDay : false
    /*int*/    , entryCount : 0
    /*String*/ , entryName : 'entry'
    /*String*/ , entryCountName : 'entryCount'
    /*Array*/  , entries : []

    , Create: Ispaces.Create

    , Constants: (function() {
        let Constants = Ispaces.Constants
        , Characters = Constants.Characters
        ;
        return {
              FORWARDSLASH : Characters.FORWARDSLASH
            , EMPTY : Characters.EMPTY
            , COLON : Characters.COLON
            , UL : Constants.ElementNames.UL
            , ST : 'st'
            , ND : 'nd'
            , RD : 'rd'
            , YEAR : 'year'
            , MONTH : 'Month'
            , WEEK : 'Week'
            , DAY : 'Day'
            , TODAY : 'Today'
            , COMMASPACE : ', '
            , F7F7F7 : '#f7f7f7'
            , CCC1 : '#ccc 1px solid'
        }
    })()

    , Events: (function() {  // "Events" property to reference events used in this application
        let Events = Ispaces.Constants.Events;
        return {
            CLICK       : Events.CLICK
          , MOUSEUP     : Events.MOUSEUP
          , MOUSEDOWN   : Events.MOUSEDOWN
          , MOUSEMOVE   : Events.MOUSEMOVE
          , CONTEXTMENU : Events.CONTEXTMENU
        }
    })()

    , configure: function(config) {  // the config object can be passed to this configure the application
        Ispaces.log.debug(this.classId+'.configure('+config+')');

        this.id = new Ispaces.StringBuilder([
            this.classId
          , Ispaces.Constants.Characters.UNDERSCORE
          , this.instanceId  // The instanceId gets set in the super class Ispaces.Persistable.
        ]).asString();

        Ispaces.log.debug('this.id = '+this.id);

        if(config) {
            this.config = config;
            this.contextUrl = config.contextUrl;
            this.backendUrl = config.backendUrl;
            //this.instagramAccessToken = config.instagramAccessToken;
            //this.instagramUsername = config.instagramUsername;
            Ispaces.log.debug('this.contextUrl = '+this.contextUrl);
            Ispaces.log.debug('this.backendUrl = '+this.backendUrl);

            console.log('this.config.clientId = '+this.config.clientId);
            console.log('this.config.instagramClientId = '+this.config.instagramClientId);
            console.log('this.config.instagramAccessToken = '+this.config.instagramAccessToken);
            console.log('this.config.instagramUsername = '+this.config.instagramUsername);
            console.log('this.config.instagramError = '+this.config.instagramError);
        }

        this.daysInWeek=this.DAYS_CHAR.length;

        this.populateYearMonthDay();
    }

    , log: function(x) {
        //console.log('getFacebookFields()');
        //this.divMain.add(this.Create.createText(x));
        this.divMain.add(this.Create.createDiv(this.Create.createText(x)));
    }

    /**
    * This initializes the UI.
    * This is where the DOM is created and the window is shown.
    */
    , init: function() {
        Ispaces.log.debug(this.id+'.init()');
        let thisApplication = this;  // Set a shortcut reference to 'this' for minification performance.
        this.divApplication = this.createApplication().setClass(this.classId); // Create the application div.
        //thisApplication.setDimensions(); // A call to set the dimensions of the window after it has been built and added to the DOM.
        Ispaces.log.debug(this.id+'.init(): this.divApplication = '+this.divApplication);
        //Ispaces.log.alert(this.id+'.init(): this.divApplication = '+this.divApplication);
        thisApplication.resizable = {  // Set the 'resizable' object for this application. @see ResizableHandle & DraggableHandle
            setWidthPixels: thisApplication.setWidthPixels.bind(thisApplication)
          , setHeightPixels: thisApplication.setHeightPixels.bind(thisApplication)
        };
        let resizableWindow = thisApplication.resizableWindow; // Grab a local reference to this.resizableWindow.
        resizableWindow.addResizables(); //  Add the resizable handles to the resizable window.
        resizableWindow.addApplication(); // Add the application to the resizable window.
        resizableWindow.hide(); // Hide the application before appending it to the DOM.

        //body.add(this.divApplication);
        this.launch(); // Launch the application by appending it to the DOM.

        //this.populateData();
        this.monthDiv = this.createMonthCalendar();
        this.divMain.add(this.monthDiv);
        this.refreshMonth();
        //thisApplication.setDimensions(); // A call to set the dimensions of the window after it has been built and added to the DOM.
    }

    , setDimensions: function() {
        Ispaces.log.debug(this.id+'.setDimensions()');
        let windowWidth = window.innerWidth;
        Ispaces.log.debug('windowWidth = '+windowWidth);
        //Ispaces.log.alert('windowWidth = '+windowWidth);
        let windowHeight = window.innerHeight;
        Ispaces.log.debug('windowHeight = '+windowHeight);
        //alert('windowHeight = '+windowHeight);
    }

    , createApplication: function() {
        Ispaces.log.debug(this.classId+'.createApplication()');


        //let divMain=this.createMain();

        let thisApplication = this
        , Create = this.Create
        , createDiv = Create.createDiv
        , createDivCell = Create.createDivCell
        , createCell = Create.createCell
        , createDivRow = Create.createDivRow
        , createRow = Create.createRow
        , createDivTable = Create.createDivTable
        , createText = Create.createText
        , createTextI18n = Create.createTextI18n;

        /*
         * Create the ResizableWindow setting a reference to this.resizableWindow.
         * Order is especially important here, in that the DraggableApplication required the reference to 'this.resizableWindow' to be set.
         */
        let resizableWindow = this.resizableWindow = new Ispaces.ResizableWindow(this); // DraggableApplication requires this.resizableWindow
        let titlebar = resizableWindow.createTitlebar();  // Some applications might not want the titlebar. Leave it up to the application to decide if it wants to create one.
        new Ispaces.DraggableApplication(thisApplication, titlebar);

        let cellTitlebar = createDivCell(titlebar)
        , rowTitlebar = createDivRow(cellTitlebar)
        ;

        //resizableWindow.setTitlebarHeight(33);
        //resizableWindow.titlebar.bo(0);
        //resizableWindow.titlebar.ba('transparent');

        this.menu = this.createMenu();

        let divMain = this.divMain = this.createMain()
        , cellMain = createDivCell(divMain).setClass("cell-main")
        , rowMain = createDivRow(cellMain);

        divMain.setHeightPercent(100);
        cellMain.setHeightPercent(100);
        rowMain.setHeightPercent(100);

        /*
        let bottomMenu = this.createBottomMenu()
        , cellBottom = createDivCell(bottomMenu)
        , tableBottom = createDivTable(createDivRow(cellBottom))
        , rowBottom = createDivRow(tableBottom)
        ;
        */

        //this.divApplication.addAll([this.menu,this.divMain]);

        let divTable = this.divTable = Create.createDivTable([
            rowTitlebar
          , this.menu
          , rowMain
          //, rowBottom
        ]);

        //this.divApplication.wihi(this.windowWidth,this.windowHeight);

        /*
         * Style
         */
        //tableBottom.setWidthPercent(100);
        //cellBottom.setOverflow(Ispaces.Constants.Properties.HIDDEN);
        //cellBottom.setMaxWidth(1); // Strangely enough, this allows the bottom menu overflow:hidden to work
        //let height=33;
        //rowBottom.setHeightPixels(height),rowBottom.setMaxHeight(height);
        divTable.setWidthHeightPercent(100);
        divTable.setOverflow(Ispaces.Constants.Properties.HIDDEN);

        //return Create.createDiv(divTable);
        return Create.createDiv(divTable).setHeightPercent(100);
        /*
        //let divMain = this.divMain = createDiv([
        let divMainTable = createDivTable([
            createRow(divTableInstagramApiWidget)
          , createRow(divTableOutput)
        ]);
        let divMain = this.divMain = createDiv(divMainTable).setClass('panel-body');
        let divTable = createDiv([
            divHeader
          , divMain
        ]).setClass('panel panel-primary');
        let divTableContainer = createDivTable(createCell(divTable)).setClass('container-fluid');
        divMainTable.setWidthHeightPercent(100);
        divTableContainer.setWidthHeightPercent(100);
        //return divTable
        return divTableContainer
        */
    }

    , createMain: function() {
        Ispaces.log.debug(this.classId+'.createMain()');
        //let main=this.Create.createElement(Ispaces.Constants.ElementNames.DIV);
        //let main=this.Create.createElement(Ispaces.Constants.ElementNames.DIV);
        let main = this.Create.createDiv();
        //main.wihi(this.windowWidth,this.apHeight);
        //main.miWi(222);
        return main;
    }

    , createMenu: function() {
        Ispaces.log.debug('createMenu()');
        
        let thisApplication=this; // Create a closure on this
        let cN='buttons';
        let buttonHeight=13;
        let ymdMargin='7px 0 0 2px';
        let calPrev='calprev';
        let calNext='calnext';
        let widthSelector=108;

        let Create = this.Create
        , createDiv = Create.createDiv
        , createCell = Create.createCell
        , createRow = Create.createRow
        , createDivTable = Create.createDivTable
        , createText = Create.createText
        , createTextI18n = Create.createTextI18n
        , createButton = Create.createButton
        ;

        // year
        /*
        //let buttonYearPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.setYear(thisApplication.year-1);thisApplication.divYear.replaceFirst(createText(thisApplication.year))});
        let buttonYearPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.prevYear()});
        let divYearPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divYearPrev.alM();
        divYearPrev.add(buttonYearPrev);
        */
        let buttonPaddingMWD='6px 13px 6px 13px';

        //let buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},null,null,'0',buttonPaddingMWD);
        //let buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},null,null,'0','6px 13px 6px 13px');
        //let buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},25,18,'0','0');
        //let buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},15,22,'0',null);
        //let buttonYearPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevYear()},15,21,'0','7px 4px 0px 4px');
        //let buttonYearPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevYear()},22,22,'0','4px 2px 2px 2px');
        let buttonYearPrev = createButton(createText('Previous Year'));
        buttonYearPrev.onclick = function(){thisApplication.prevYear()};
        //buttonYearPrev.setWidthHeightPixels(22);
        //buttonYearPrev.setPadding('4px 2px 2px 2px');

        //let imgPrev=cImg(DIR_ICON+'window/left-next.gif',15);
        //let imgPrev=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue.gif',15);
        //let imgPrev=cImg(DIR_IMAGES+'arrow/next-white-trans-7x12.gif',15);
        //let imgPrev=cImg(DIR_IMAGES+'arrow/dev/Right_Blue_Arrow_clip_art_s.gif',15);
        //buttonYearPrev.add(imgPrev);
        //buttonYearPrev.alCM();
        //buttonYearPrev.add(createText('Today'));
        //let divYearPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divYearPrev=createCell();
        //divYearPrev.wip(1);
        divYearPrev.add(buttonYearPrev);

        /*
        this.divYear=this.Create.createDiv();
        this.divYear.wi(33);
        this.divYear.fW(Ispaces.Constants.Properties.BOLD);
        this.divYear.ma(ymdMargin);
        this.divYear.add(createText(this.year));
        */

        this.divYear = createCell(createRow([createText(this.year)]));
        //this.divYear.fW(Ispaces.Constants.Properties.BOLD);
        //this.divYear.pa('0 8px 0 8px ');
        //this.divYear.setClass('blankoff');

        /*
        //let buttonYearNext=Ispaces.ui.createDivButton(calNext,function(){thisApplication.setYear(thisApplication.year+1);thisApplication.divYear.replaceFirst(createText(thisApplication.year))});
        let buttonYearNext=Ispaces.ui.createDivButton(calNext,function(){thisApplication.nextYear()});
        let divYearNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divYearNext.add(buttonYearNext);
        divYearNext.alM();
        */

        //let buttonYearNext = Ispaces.ui.createAButton('topmenu-right',function(){thisApplication.nextYear()},22,22,'0','4px 2px 2px 2px');
        //let buttonYearNext = createButton(); //'topmenu-right',function(){thisApplication.nextYear()},22,22,'0','4px 2px 2px 2px');
        let buttonYearNext = createButton(createText('Next Year')); //'topmenu-right',function(){thisApplication.nextYear()},22,22,'0','4px 2px 2px 2px');
        buttonYearNext.onclick = function(){thisApplication.nextYear()};
        //let buttonYearNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextYear()},24,null,'0','4px');
        //let imgNext=cImg(DIR_IMAGES+'arrow/next-6B6D6B.gif',15);
        //let imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
        //let imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue-right.gif',20);
        //let imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue-right-30x.gif',20);
        //let imgNext=cImg(DIR_IMAGES+'arrow/dev/Untitled-5.gif',30);
        //let imgNext=cImg(DIR_IMAGES+'arrow/dev/right-on.gif',20);
        //buttonYearNext.add(imgNext);
        //let divYearNext = Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divYearNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divYearNext.wip(1);
        divYearNext.add(buttonYearNext);

        let yearDivRow=createRow([divYearPrev,this.divYear,divYearNext]);
        let yearDiv=createCell(yearDivRow);

        // month
        /*
        //let buttonMonthPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.setMonth(thisApplication.month-1);thisApplication.divMonth.replaceFirst(createText(thisApplication.getMnth(thisApplication.month)))});
        let buttonMonthPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.prevMonth()});
        let divMonthPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divMonthPrev.alM();
        divMonthPrev.add(buttonMonthPrev);
        */
        //let buttonMonthPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevMonth()},15,21,'0','7px 4px 0px 4px');
        //let buttonMonthPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevMonth()},22,22,'0','4px 2px 2px 2px');
        //let buttonMonthPrev = createButton();//'topmenu-left',function(){thisApplication.prevMonth()},22,22,'0','4px 2px 2px 2px');
        let buttonMonthPrev = createButton(createText('Previous Month'));//'topmenu-left',function(){thisApplication.prevMonth()},22,22,'0','4px 2px 2px 2px');
        buttonMonthPrev.onclick = function(){thisApplication.prevMonth()};
        //let imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
        //buttonMonthPrev.add(imgPrev);
        //let divMonthPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divMonthPrev = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divMonthPrev.wip(1);
        divMonthPrev.add(buttonMonthPrev);

        ///*
        //this.divMonth=this.create.tag(Ispaces.Constants.ElementNames.DIV);
        this.divMonth=createDiv();
        //this.divMonth.wi(widthSelector);
        //this.divMonth.fW(Ispaces.Constants.Properties.BOLD);
        this.divMonth.add(createText(this.getMnth()));
        //*/
        let cellMonth=createCell(createRow([this.divMonth]));
        //cellMonth.wi(widthSelector);
        //cellMonth.fW(Ispaces.Constants.Properties.BOLD);
        //cellMonth.pa('0 8px 0 8px ');
        //cellMonth.alLM();

        cellMonth.setClass('blankoff');

        /*
        let buttonMonthNext=Ispaces.ui.createDivButton(calNext,function(){thisApplication.setMonth(thisApplication.month+1);thisApplication.divMonth.replaceFirst(createText(thisApplication.getMnth(thisApplication.month)))});
        let buttonMonthNext=Ispaces.ui.createDivButton(calNext,function(){thisApplication.nextMonth()});
        let divMonthNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divMonthNext.alM();
        divMonthNext.add(buttonMonthNext);
        */
        //let buttonMonthNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextMonth()},15,21,'0','7px 4px 0px 4px');
        //let buttonMonthNext=Ispaces.ui.createAButton('topmenu-right',function(){thisApplication.nextMonth()},24,22,'0','4px 4px 2px 4px');
        //let buttonMonthNext=Ispaces.ui.createAButton('topmenu-right',function(){thisApplication.nextMonth()},22,22,'0','4px 2px 2px 2px');
        //let buttonMonthNext = createButton(); //'topmenu-right',function(){thisApplication.nextMonth()},22,22,'0','4px 2px 2px 2px');
        let buttonMonthNext = createButton(createText('Next Month')); //'topmenu-right',function(){thisApplication.nextMonth()},22,22,'0','4px 2px 2px 2px');
        buttonMonthNext.onclick = function(){thisApplication.nextMonth()};
        //let imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
        //let imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-black-rounded-on-blue.gif',20);
        //buttonMonthNext.add(imgNext);
        //let divMonthNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divMonthNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divMonthNext.wip(1);
        divMonthNext.add(buttonMonthNext);


        //let monthDivRow=createRow([divMonthPrev,this.divMonth,divMonthNext]);
        let monthDivRow=createRow([divMonthPrev,cellMonth,divMonthNext]);
        this.monthSelector=createCell(monthDivRow);

        // week
        /*
        let buttonWeekPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.prevWeek()});
        let divWeekPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divWeekPrev.alM();
        divWeekPrev.add(buttonWeekPrev);
        */
        //let buttonWeekPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevWeek()},15,21,'0','7px 4px 0px 4px');
        //let buttonWeekPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevWeek()},22,22,'0','4px 2px 2px 2px');
        //let buttonWeekPrev = createButton();//'topmenu-left',function(){thisApplication.prevWeek()},22,22,'0','4px 2px 2px 2px');
        let buttonWeekPrev = createButton(createText('Previous Week'));//'topmenu-left',function(){thisApplication.prevWeek()},22,22,'0','4px 2px 2px 2px');
        buttonWeekPrev.onclick = function(){thisApplication.prevWeek()};
        //let imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
        //buttonWeekPrev.add(imgPrev);
        //let divWeekPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divWeekPrev = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divWeekPrev.wip(1);
        divWeekPrev.add(buttonWeekPrev);

        //this.divWeek=this.create.tag(Ispaces.Constants.ElementNames.DIV);
        this.divWeek = createDiv();
        //this.divWeek.wi(widthSelector);
        //this.divWeek.fW(Ispaces.Constants.Properties.BOLD);
        this.divWeek.add(createText(this.getWeek()));
        let cellWeek = createCell(createRow([this.divWeek]));
        //cellWeek.wi(widthSelector);
        //cellWeek.fW(Ispaces.Constants.Properties.BOLD);
        //cellWeek.pa('0 8px 0 8px ');
        //cellWeek.alLM();
        //cellWeek.setClass('blankoff');

        //let buttonWeekNext=Ispaces.ui.createAButton('topmenu-right',function(){thisApplication.nextWeek()},22,22,'0','4px 2px 2px 2px');
        //let buttonWeekNext=Ispaces.ui.createAButton('topmenu-right',function(){thisApplication.nextWeek()},22,22,'0','4px 2px 2px 2px');
        //let buttonWeekNext = createButton(); //'topmenu-right',function(){thisApplication.nextWeek()},22,22,'0','4px 2px 2px 2px');
        let buttonWeekNext = createButton(createText('Next Week')); //'topmenu-right',function(){thisApplication.nextWeek()},22,22,'0','4px 2px 2px 2px');
        buttonWeekNext.onclick = function(){thisApplication.nextWeek()};
        //let imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
        //buttonWeekNext.add(imgNext);
        //let divWeekNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divWeekNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divWeekNext.wip(1);
        divWeekNext.add(buttonWeekNext);

        let weekDivRow=createRow([divWeekPrev,cellWeek,divWeekNext]);
        this.weekSelector=createCell(weekDivRow);
        this.weekSelector.hide();

        // day
        /*
        let buttonDayPrev=Ispaces.ui.createDivButton(calPrev,function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))});
        let divDayPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divDayPrev.alM();
        divDayPrev.add(buttonDayPrev);
        */
        //let buttonDayPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},15,21,'0','7px 4px 0px 4px');
        //let buttonDayPrev=Ispaces.ui.createAButton('topmenu-left',function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        //let buttonDayPrev = createButton();//'topmenu-left',function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        let buttonDayPrev = createButton(createText('Previous Day'));//'topmenu-left',function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        buttonDayPrev.onclick = function(){thisApplication.prevDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))};
        //let imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
        //buttonDayPrev.add(imgPrev);
        //let divDayPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divDayPrev = createCell(); //'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divDayPrev.wip(1);
        //divDayPrev.alB();
        divDayPrev.add(buttonDayPrev);

        //this.divDay=this.create.tag(Ispaces.Constants.ElementNames.DIV);
        this.divDay = createDiv();
        //this.divDay.wi(widthSelector);
        //this.divDay.fW(Ispaces.Constants.Properties.BOLD);
        //this.divDay.ma(ymdMargin);
        this.divDay.add(createText(Ispaces.Constants.Characters.NBSP));
        this.divDay.setClass('blank');

        /*
        let buttonDayNext=Ispaces.ui.createDivButton(calNext,function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))});
        let divDayNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divDayNext.alM();
        divDayNext.add(buttonDayNext);
        */
        //let buttonDayNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},15,21,'0','7px 4px 0px 4px');
        //let buttonDayNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        //let buttonDayNext = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        let buttonDayNext = createButton(createText('Next Day'));//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
        buttonDayNext.onclick = function(){thisApplication.nextDay();thisApplication.divDay.replaceFirst(createText(thisApplication.getDayTh(thisApplication.getDayOfWeek(),thisApplication.dayOfMonth)))};
        //let imgNext=Ispaces.ui.createImage(Ispaces.Constants.Paths.IMAGES+'arrow/right-next.gif',15);
        //buttonDayNext.add(imgNext);
        //let divDayNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divDayNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divDayNext.wip(1);
        //divDayNext.alB();
        divDayNext.add(buttonDayNext);

        let dayDivRow=createRow([divDayPrev,this.divDay,divDayNext]);
        this.daySelector=createCell(dayDivRow);

        /*
        //let buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-eee',function(){thisApplication.today()},null,null,Constants.Characters.ZERO,'1px 13px 1px 13px');
        let buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-hover',function(){thisApplication.today()},null,null,Constants.Characters.ZERO,'1px 13px 1px 13px');
        buttonToday.add(createText(TODAY));
        let divToday=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        divToday.add(buttonToday);
        divToday.alB();
        divToday.paL(PX8);
        divToday.paB(Ispaces.Constants.Strings.PX3);
        */

        //let buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},null,null,'0',buttonPaddingMWD);
        //let buttonToday = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},null,null,'0',buttonPaddingMWD);
        let buttonToday = createButton(createText('Today'));//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.start()},null,null,'0',buttonPaddingMWD);
        //buttonToday.add(imgOn);
        //buttonToday.add(createText('Today'));
        //let divToday=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divToday = createCell(); // 'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divToday.wip(1);
        //divToday.alT();
        divToday.add(buttonToday);


        //let menuRow=createRow([dayDiv,this.weekSelector,this.monthSelector,yearDiv,divToday]);
        let menuRow=createRow([this.daySelector,this.weekSelector,this.monthSelector,yearDiv,divToday]);
        let menuRowCell=createCell(menuRow);

        //menuRowCell.wip(1);
        //menuRowCell.nowrap();

        let blankDiv=createCell();
        //blankDiv.wihi(1);
        let blankRow=createRow([blankDiv]);
        let blankTable=createCell(blankRow);
        blankTable.setClass('blank');
        //blankTable.alT();

        //let buttonMonth=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){thisApplication.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
        //this.buttonMonth=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
        //this.buttonMonth = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
        this.buttonMonth = createButton(createText('Month'));//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
        this.buttonMonth.onclick = function(){thisApplication.showMonth()};
        //buttonMonth.add(createText(MONTH));
        //this.buttonMonth.add(createText(this.Constants.MONTH));
        //let divMonth=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divMonth = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divMonth.wip(1);
        divMonth.add(this.buttonMonth);

        //let buttonWeek=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){thisApplication.showWeek()},null,null,'0',buttonPaddingMWD);
        //this.buttonWeek=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showWeek()},null,null,'0',buttonPaddingMWD);
        this.buttonWeek = createButton(createText(this.Constants.WEEK));//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showWeek()},null,null,'0',buttonPaddingMWD);
        this.buttonWeek.onclick = function(){thisApplication.showWeek()};
        //buttonWeek.add(createText(WEEK));
        //this.buttonWeek.add(createText(this.Constants.WEEK));
        //let divWeek=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divWeek = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divWeek.wip(1);
        divWeek.add(this.buttonWeek);

        //let buttonDay=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){thisApplication.showDay()},null,null,'0',buttonPaddingMWD);
        //this.buttonDay=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showDay()},null,null,'0',buttonPaddingMWD);
        this.buttonDay = createButton(createText(this.Constants.DAY));//Constants.Strings.POSITIVE+'-notop-on',function(){thisApplication.showDay()},null,null,'0',buttonPaddingMWD);
        this.buttonDay.onclick = function(){thisApplication.showDay()};
        //buttonDay.add(createText(DAY));
        //this.buttonDay.add(createText(this.Constants.DAY));
        //let divDay=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        let divDay = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
        //divDay.wip(1);
        divDay.add(this.buttonDay);

        let dayWeekMonthRow=createRow([divMonth,divWeek,divDay]);
        let dayWeekMonth=createCell(dayWeekMonthRow);
        //dayWeekMonth.wip(1);
        //dayWeekMonth.alR();
        //dayWeekMonth.alT();

        //let menuDivTable=this.Create.createDivTable([menuRowCell,dayWeekMonth]);
        let menuDivTable = createDivTable([menuRowCell,blankTable,dayWeekMonth]);
        //menuDivTable.wip(100);
        //menuDivTable.boB('#A0A0A0 1px solid');

        //let menu=this.create.tagClass(Ispaces.Constants.ElementNames.DIV,'menu');
        let menu = createDiv().setClass('menu');
        //menu.ow(Ispaces.Constants.Properties.HIDDEN);
        menu.add(menuDivTable);

        //thisApplication=null; // Dereference the closure so that it can be garbage collected.

        return menu;

    } // createMenu : function() {
          
    , createDivHeader: function() {
        console.log('createDivHeader()');

        let Create = this.Create
        , createElement = Create.createElement
        , createDiv = Create.createDiv
        , createSpan = Create.createSpan
        , createCell = Create.createCell
        , createDivTable = Create.createDivTable
        , createButton = Create.createButton
        , createText = Create.createText
        , createTextI18n = Create.createTextI18n
        ;

        //let divAuthenticate = this.createDivAuthenticate();
        //let cellAuthenticate = createCell(divAuthenticate);
        let divAuthenticate;
        let cellAuthenticate;
        let divUsername;

        if(this.config.instagramAccessToken) {

            //divUsername = createDiv(createText(this.config.instagramUsername)).setClass('label label-success').setFontSize('100%');
            divUsername = createButton(createText(this.config.instagramUsername)).setClass('btn btn-success btn-sm').setFontSize('100%');
            divUsername.addListener(this.Events.CLICK, this.clickButtonUsername.bind(this, divUsername));

            //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
            //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
            //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success').setFontSize('100%');
            //let spanAuthenticate = createSpan(createText(this.config.instagramUsername)).setClass('label label-success');
            //let h3Authenticate = createElement('h3').add(spanAuthenticate);
            //cellAuthenticate.add(h3Authenticate);
            //return h3Authenticate;

            let divLogout = createButton(createText('Logout')).setClass('btn btn-md btn-success');
            //divLogout.addListener(this.Events.CLICK, window.location.href='http://www.example.com');
            divLogout.addListener(this.Events.CLICK, this.clickButtonLogout.bind(this, divLogout));

            cellAuthenticate = createCell([
                //divAuthenticate
                divLogout
            ]).setClass('autosized');

        } else {

            divAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-md btn-success');
            divAuthenticate.addListener(this.Events.CLICK, this.mouseDownButtonAuthenticate.bind(this, divAuthenticate));

            cellAuthenticate = createCell(divAuthenticate);
        }


        // {"error_type": "OAuthException", "code": 400, "error_message": "Redirect URI doesn't match original redirect URI"}
        let instagramError = this.config.instagramError;
        if(instagramError) {
            let errorMessage = instagramError.error_message;
            console.log('errorMessage = '+errorMessage);
            alert('errorMessage = '+errorMessage);

            //let divLabelError = createDiv(createText(errorMessage)).setClass('label label-danger lb-lg');
            let spanLabelError = createSpan(createText(errorMessage)).setClass('label label-danger label-large');
            let h3Error = createElement('h3').add(spanLabelError);
            cellAuthenticate.add(h3Error);
        }

        //let divHeader = createDivTable(createText(this.appName)).setClass('window-title');
        let h3Header = createElement('h3').add(createText(this.appName)).setClass('panel-title');
        let cellHeading = createCell(h3Header);
        let divTableHeading = createDivTable(cellHeading);
        if(divUsername != null) {
            divTableHeading.add(createCell(divUsername));
            divUsername.setMarginLeft(20);
            //divUsername.setPaddingLeft(20);
        }

        //let divHeader = createDivTable(createText(this.appName)).setClass('window-title panel-heading');
        //let divHeader = createDiv(h3Header).setClass('window-title panel panel-primary');
        //let divHeader = createDiv(h3Header).setClass('panel panel-primary');
        //let divHeader = createDiv(h3Header).setClass('panel-heading');
        let divHeader = createDivTable([
            //cellHeading
            createCell(divTableHeading)
          , cellAuthenticate
        ]).setClass('panel-heading');

        divHeader.setWidthPercent(100);

        return divHeader;
        /*
        let cellHeader = createCell(divHeader);
        //let cellHeader = createCell(divHeader).setClass('panel panel-primary');

        //let divButtonAuthenticate = createDiv(createText('Authenticate')).setClass('instagram-button large-button');
        //let divButtonAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-default');
        //let cellButtonAuthenticate = createCell(divButtonAuthenticate);
        let cellAuthenticate = this.createCellAuthenticate();
        let divTable = createDivTable([
            cellHeader
          , cellAuthenticate
        ]);
        //]).setClass('panel-heading');
        //divButtonAuthenticate.setPaddingRight(20);
        cellAuthenticate.setPaddingRight(20);
        //cellButtonAuthenticate.setMarginRight(20);
        divTable.setWidthPercent(100);
        //divTable.setBorder('red 1px solid');
        //divHeader.setBorder('red 1px solid');
        //cellHeader.setBorder('green 1px solid');
        //divTable.setClass('panel panel-primary');
        return divTable;
        */
    }

    /*
    , createDivAuthenticate: function() {
        console.log('createDivAuthenticate()');

        let Create = this.Create
        , createElement = Create.createElement
        , createDiv = Create.createDiv
        , createSpan = Create.createSpan
        , createCell = Create.createCell
        , createDivTable = Create.createDivTable
        , createButton = Create.createButton
        , createText = Create.createText
        , createTextI18n = Create.createTextI18n
        ;

        let divAuthenticate;

        if(this.config.instagramAccessToken) {

            divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
            //let spanAuthenticate = createSpan(createText(this.config.instagramUsername)).setClass('label label-success');
            //let h3Authenticate = createElement('h3').add(spanAuthenticate);
            //cellAuthenticate.add(h3Authenticate);
            //return h3Authenticate;

            divLogout = createButton(createText('Logout')).setClass('btn btn-warning');
            //divLogout.addListener(this.Events.CLICK, window.location.href='http://www.example.com');

        } else {

            divAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-default');
            divAuthenticate.addListener(this.Events.CLICK, this.mouseDownButtonAuthenticate.bind(this, divAuthenticate));
        }

        return divAuthenticate;
    }
    */

    /*
    , createCellAuthenticate: function() {
        console.log('createCellAuthenticate()');

        let Create = this.Create
        , createDiv = Create.createDiv
        , createCell = Create.createCell
        , createDivTable = Create.createDivTable
        , createButton = Create.createButton
        , createText = Create.createText
        , createTextI18n = Create.createTextI18n
        ;

        let cellAuthenticate;

        //if(this.instagramAccessToken) {
        if(this.config.instagramAccessToken) {
            let divLabelAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success');
            cellAuthenticate = createCell(divLabelAuthenticate);
        } else {
            let divButtonAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-default');
            cellAuthenticate = createCell(divButtonAuthenticate);
            divButtonAuthenticate.addListener(this.Events.CLICK, this.mouseDownButtonAuthenticate.bind(this, divButtonAuthenticate));
        }

        return cellAuthenticate;
    }
    */

    , clickButtonLogout: function(button, e) {
        Ispaces.log.debug(this.id+'.clickButtonLogout(button:'+button+', e:'+e+')');
        console.log(this.id+'.clickButtonLogout(button:'+button+', e:'+e+')');

        let logoutUrl = new Ispaces.StringBuilder()
          .append(this.contextUrl)
          .append("/logout")
          .toString();

        console.log('logoutUrl = '+logoutUrl);

        window.location.href = logoutUrl;
    }

    , mouseDownButtonAuthenticate: function(button, e) {
        Ispaces.log.debug(this.id+'.mouseDownButtonAuthenticate(button:'+button+', e:'+e+')');
        console.log(this.id+'.mouseDownButtonAuthenticate(button:'+button+', e:'+e+')');

        let redirectUri = new Ispaces.StringBuilder()
          .append(this.contextUrl)
          .append("/instagram-redirect")
          .toString();

        let url = new Ispaces.StringBuilder()
          .append('https://api.instagram.com/oauth/authorize/')
          .append('?client_id=').append(this.config.instagramClientId)
          .append('&redirect_uri=').append(redirectUri)
          .append('&response_type=code')
          //.append('&scope=basic+public_content+follower_list+comments+relationships+likes')
          .toString();
  
        console.log(url);

        console.log('Authorizing Instagram...');
        this.loadUrl(url);
    }

    , loadUrl: function(location) {
        //this.document.location.href = location;
        window.location.href = location;
    }

    , populateData: function() {
        Ispaces.log.debug(this.classId+'.populateData()');
        this.checkLocalStorage(this.entriesName);
        //this.showEntries();
        //this.removeEntries();
    }

    , populateYearMonthDay: function(date) {
        Ispaces.log.debug(this.classId+'.populateYearMonthDay(date:'+date+')');
        this.year = (date||this.now).getFullYear();
        this.month = (date||this.now).getMonth();
        this.weekday = (date||this.now).getDay();
        this.date = (date||this.now).getDate();
        Ispaces.log.debug('this.year = '+this.year);
        Ispaces.log.debug('this.month = '+this.month);
        Ispaces.log.debug('this.weekday = '+this.weekday);
        Ispaces.log.debug('this.date = '+this.date);
        this.dateSelected=this.date;
        this.monthSelected=this.month;
    }

    , checkRemoteStorage:function(id){
        Ispaces.log.debug(this.classId+'.checkRemoteStorage('+id+')');
    }

    , checkLocalStorage:function(id){
        Ispaces.log.debug(this.classId+'.checkLocalStorage('+id+')');
        /*
        let thisApplication=this;
        //this.store.get(id,function(ok, val) {
        this.store.get(id,function(ok,val){
        if(ok&&val){
            Ispaces.log.alert(thisApplication.classId+'.checkLocalStorage('+id+'): val = ' + val);
            this.entries=val;
            Ispaces.log.alert(thisApplication.classId+'.checkLocalStorage('+id+'): this.entries = ' + this.entries);
        }
    },this);
    */
    //this.store.get(id,this.setEntries,this);
    }

    , setDayWeekMonth : function(ok,val) {
        Ispaces.log.alert(this.classId+'.setDayWeekMonth('+ok+','+val+')');
        if (ok && val) {
            Ispaces.log.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): val = ' + val);
            Ispaces.log.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): typeof val = ' + typeof val);
            //Ispaces.log.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): Common.parens(val) = ' + Common.parens(val));
            //this.dayWeekMonth=eval(Common.parens(val));
            eval(Ispaces.Common.parens(val));
          /*
          if(val=='month'){
            Ispaces.log.alert(this.classId+'.setDayWeekMonth('+ok+','+val+'): this.showMonth()');
            this.showMonth();
          }else if(val=='week'){
            Ispaces.log.alert(this.classId+'.setDayWeekMonth('+ok+','+val+'): this.showWeek()');
            this.showWeek();
          }
          */
        } else {
            Ispaces.log.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): No '+this.classId+' dayWeekMonth entry found.');
            this.showMonth();
        }
    }

    , setEntries : function(ok,val) {
        Ispaces.log.alert(this.classId+'.setEntries('+ok+','+val+')');
        if(ok&&val){
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): val = ' + val);
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): typeof val = ' + typeof val);
          //this.entries=val;
          this.entries=eval(Ispaces.Common.parens(val));
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): this.entries = ' + this.entries);
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): typeof this.entries = ' + typeof this.entries);
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): this.entries.length = ' + this.entries.length);
        }else{
          Ispaces.log.debug(this.classId+'.setEntries('+ok+','+val+'): No '+this.classId+' entries found.');
        }
    }

    , nextYear: function() {
        Ispaces.log.debug(this.classId+'.nextYear()');
        this.setYear(this.year+1);
        this.refreshMonth();
    }

    , prevYear: function() {
        Ispaces.log.debug(this.classId+'.prevYear()');
        this.setYear(this.year-1);
        this.refreshMonth();
    }

    , setYear: function(year) {
        Ispaces.log.debug(this.classId+'.setYear('+year+')');
        this.year=year;
        this.divYear.replaceFirst(this.Create.createText(this.year));
    }

    , prevMonth: function() {
        Ispaces.log.debug(this.classId+'.prevMonth()');
        this.setMonth(this.month-1);
        this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
    }

    , nextMonth: function() {
        Ispaces.log.debug(this.classId+'.nextMonth()');
        this.setMonth(this.month+1);
        this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
    }

    , setMonth: function(month) {
        Ispaces.log.debug(this.classId+'.setMonth('+month+')');
        if (month < 0) {
            month = 11;
            this.year--;
            this.divYear.replaceFirst(this.Create.createText(this.year));
        } else if (month>11) {
            month = 0;
            this.year++;
            this.divYear.replaceFirst(this.Create.createText(this.year));
        }
        this.month=month;
        this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)));
        this.refreshMonth();
    }

    , getMnth: function(month) { return this.MONTHS[(month ? month : this.month)] }

    , getMnthPrev: function(month) {
        if(month==0){
          return 11;
        }
        return month;
    }

    , setDayOfMonth: function(dayOfMonth) {
        this.dayOfMonth=dayOfMonth;
    }

    , prevWeek: function() {
        Ispaces.log.debug(this.classId+'.prevWeek()');
        let daysInMonth = this.getDaysInMonth();
        Ispaces.log.debug(this.classId+'.prevWeek(): daysInMonth = '+daysInMonth);
        if (!this.weekStartDate) {
          this.weekStartDate=this.getWeekStartDate();
        }
        this.weekStartDate-=this.daysInWeek;
        Ispaces.log.debug(this.classId+'.prevWeek(): this.weekStartDate = '+this.weekStartDate);
        if (this.weekStartDate <= 0) {
          this.setMonth(this.month-1);
          daysInMonth=this.getDaysInMonth();
          this.weekStartDate=(this.weekStartDate+daysInMonth); // add the zero count
          Ispaces.log.debug(this.classId+'.prevWeek(): this.weekStartDate = '+this.weekStartDate);
          this.divMonth.replaceFirst(this.Create.createText(this.getMnth()))
        }
        this.divWeek.replaceFirst(this.Create.createText(this.getWeek(this.month,this.weekStartDate)));
    }

    , nextWeek: function() {
        Ispaces.log.debug(this.classId+'.nextWeek()');
        //Ispaces.log.debug(this.classId+'.nextWeek(): this.dayOfMonth = '+this.dayOfMonth);
        //Ispaces.log.debug(this.classId+'.nextWeek(): this.date = '+this.date);
        let daysInMonth = this.getDaysInMonth();
        Ispaces.log.debug(this.classId+'.nextWeek(): daysInMonth = '+daysInMonth);
        if (!this.weekStartDate) {
          this.weekStartDate=this.getWeekStartDate();
        }
        /*
        this.date+=this.daysInWeek;
        Ispaces.log.debug(this.classId+'.nextWeek(): this.date = '+this.date);
        */
        this.weekStartDate+=this.daysInWeek;
        Ispaces.log.debug(this.classId+'.nextWeek(): this.weekStartDate = '+this.weekStartDate);

        //if(this.date>daysInMonth){
        if(this.weekStartDate>daysInMonth){

          /*
          this.date=this.date-daysInMonth;
          Ispaces.log.debug(this.classId+'.nextWeek(): this.date = '+this.date);
          */
          this.weekStartDate=this.weekStartDate-daysInMonth;
          Ispaces.log.debug(this.classId+'.nextWeek(): this.weekStartDate = '+this.weekStartDate);

          this.setMonth(this.month+1);
          //this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
          this.divMonth.replaceFirst(this.Create.createText(this.getMnth()))
        }
        //this.divWeek.replaceFirst(this.Create.createText(this.getWeek(null,this.weekStartDate)));
        this.divWeek.replaceFirst(this.Create.createText(this.getWeek(this.month,this.weekStartDate)));
        this.refreshWeek(this.weekStartDate);
    }

    , getWeekStartDate : function() {
        Ispaces.log.debug(this.classId+'.getWeekStartDate()');
        Ispaces.log.debug(this.classId+'.getWeekStartDate(): this.date = '+this.date);
        Ispaces.log.debug(this.classId+'.getWeekStartDate(): this.weekday = '+this.weekday);
        let weekStartDate=this.date-this.weekday;
        if(weekStartDate<=0){
          //this.setMonth(this.month-1);
          //let daysInMonthPrev=this.getDaysInMonth();
          let daysInMonthPrev=this.getDaysInMonth(this.month-1);
          weekStartDate=daysInMonthPrev+weekStartDate;
        }
        return weekStartDate;
    }

    , getWeek : function(month, weekStartDate) {
        Ispaces.log.debug(this.classId+'.getWeek()');
        let sb=new Ispaces.StringBuilder();
        //let month=this.MONTHS[(month?month:this.month)];
        let monthAbbr=this.MONTHS_ABBR[(month?month:this.month)];
        let daysInMonth=this.getDaysInMonth();
        sb.append(monthAbbr);
        sb.append(Ispaces.Constants.Characters.SPACE);

        if(!weekStartDate){
          Ispaces.log.debug(this.classId+'.getWeek(): this.weekday = '+this.weekday);
          weekStartDate=this.getWeekStartDate();
        }
        /*
        let weekStartDate=this.date-this.weekday;
        if(weekStartDate<=0){
          this.setMonth(this.month-1);
          let daysInMonthPrev=this.getDaysInMonth();
          weekStartDate=daysInMonthPrev+weekStartDate;
        }
        */

        Ispaces.log.debug(this.classId+'.getWeek(): weekStartDate = '+weekStartDate);
        sb.append(weekStartDate);
        sb.append(' - ');
        //sb.append(Ispaces.Constants.Characters.SPACE);sb.append(hyphen);sb.append(Ispaces.Constants.Characters.SPACE);
        //sb.append(Ispaces.Constants.Characters.SPACE);sb.append(urlhyphen);sb.append(Ispaces.Constants.Characters.SPACE);

        let weekEndDate=weekStartDate+(this.daysInWeek-1);
        if(weekEndDate>daysInMonth){
          weekEndDate=weekEndDate-daysInMonth;
          let monthNextAbbr=this.MONTHS_ABBR[(month?month+1:this.month+1)];
          Ispaces.log.debug(this.classId+'.getWeek(): monthNextAbbr = '+monthNextAbbr);
          sb.append(monthNextAbbr);
          sb.append(Ispaces.Constants.Characters.SPACE);
        }
        Ispaces.log.debug(this.classId+'.getWeek(): weekEndDate = '+weekEndDate);

        sb.append(weekEndDate);
        Ispaces.log.debug(this.classId+'.getWeek(): sb.asString() = '+sb.asString());
        return sb.asString();
    }

    , nextDay : function() {
        Ispaces.log.debug(this.classId+'.nextDay()');
        this.dayOfMonth++;
        let daysInMonth = this.getDaysInMonth();
        if (this.dayOfMonth > daysInMonth) {
            this.dayOfMonth = 1;
            this.setMonth(this.month + 1);
            this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
        }
        Ispaces.log.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
        let dayOfWeek = this.getDayOfWeek(daysInMonth);
        Ispaces.log.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
    }

    , prevDay: function() {
        Ispaces.log.debug(this.classId+'.prevDay()');
        this.dayOfMonth--;
        if (this.dayOfMonth == 0) {
          this.setMonth(this.month-1);
          let daysInMonth = this.getDaysInMonth();
          this.dayOfMonth = daysInMonth;
          this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
        }
        Ispaces.log.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
        let dayOfWeek = this.getDayOfWeek(daysInMonth);
        Ispaces.log.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
    }

    , getDayOfWeek: function(daysInMonth) {
        Ispaces.log.debug(this.classId+'.getDayOfWeek()');

        if(!daysInMonth)daysInMonth=this.getDaysInMonth();
        let dayOfMonthCount=0;
        let cols=this.daysInWeek;
        let daysCount=0;
        let rows=1;
        let daysInRowOne=this.daysInWeek-this.monthWeekday;
        Ispaces.log.debug(this.classId+'.getDayOfWeek(): daysInRowOne = '+daysInRowOne);
        daysCount+=daysInRowOne;
        Ispaces.log.debug(this.classId+'.getDayOfWeek(): daysCount = '+daysCount);
        while(daysCount<daysInMonth){
          daysCount+=this.daysInWeek;
          Ispaces.log.debug(this.classId+'.getDayOfWeek(): daysCount = '+daysCount);
          rows++;
          Ispaces.log.debug(this.classId+'.v(): rows = '+rows);
        }
        Ispaces.log.debug(this.classId+'.getDayOfWeek(): rows = '+rows);

        for(let i=0;i<rows;i++){
          for(let j=0;j<cols;j++){
            if(
              i==0&&j>=this.monthWeekday  // if it is the first row and j is greater than the day this month starts on
              ||(i>0&&dayOfMonthCount<daysInMonth) // if it is any other row
            ){
              dayOfMonthCount++;
              if(dayOfMonthCount==this.dayOfMonth){
                return this.DAYS[j];
              }
            }
          }
        }

        return Ispaces.Constants.Characters.EMPTY;
    }

    , today: function() {
        Ispaces.log.alert(this.classId+'.today()');

        this.populateYearMonthDay(new Date());
        //this.setDay(this.day);
        this.setMonth(this.month);
        this.setYear(this.year);
        //this.store.get('calls',this.setDayWeekMonth,this); // get the button to select
    }

    , setDay: function(day) {
        Ispaces.log.alert(this.classId+'.setDay('+day+')');

        this.dayOfMonth=day;
        let month=0;
        if(month<0){
            month=11;
            this.year--;
            this.divYear.replaceFirst(this.Create.createText(this.year));
        }else if(month>11){
            month=0;
            this.year++;
            this.divYear.replaceFirst(this.Create.createText(this.year));
        }
        this.month=month

        this.refreshMonth();
    }

/*
nextDay:function(){
Ispaces.log.debug(this.classId+'.nextDay()');
this.dayOfMonth++;
let daysInMonth=this.getDaysInMonth();
if(this.dayOfMonth>daysInMonth){
  this.dayOfMonth=1;
  this.setMonth(this.month+1);
  this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
}
Ispaces.log.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
let dayOfWeek=this.getDayOfWeek(daysInMonth);
Ispaces.log.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
},
*/

    , getNextHour: function(hour) {
        if (hour == 12) {
            hour=0;
        }
        hour++;
        return hour;
    }

    , showMonth: function() {
        Ispaces.log.debug(this.classId+'.showMonth()');
        if (!this.monthTable) {
            this.createMonthCalendar();
        }
        //this.store.set('calls',"this.showMonth()");
        //this.store.set('calls','month');
        this.weekSelector.hide();
        this.daySelector.hide();
        this.monthSelector.show();
        if (this.weekDiv) this.weekDiv.hide();
        this.monthDiv.show();
        this.buttonMonth.setClass('positive-notop');
        this.buttonWeek.setClass('positive-notop-on');
        this.buttonDay.setClass('positive-notop-on');
        this.refreshMonth();
    }

    , showWeek: function() {
        Ispaces.log.debug(this.classId+'.showWeek()');
        //this.store.set('calls',"this.showWeek()");
        //this.store.set('calls','week');

    /*
        if(!this.showingDay){ // if we click the week button a second time, show the day
          this.showDay();
          return;
        }
    */

        if (!this.weekHeaderTable) {
          this.createWeekCalendar();
        }

        if (this.monthDiv) this.monthDiv.hide();
        this.monthSelector.hide();
        this.daySelector.hide();
        this.weekSelector.show();
        this.buttonMonth.setClass('positive-notop-on');
        this.buttonDay.setClass('positive-notop-on');
        this.buttonWeek.setClass('positive-notop');

        if (this.showingDay) {
            let cols=this.weekHeaderTds.length;
            for(let i=0;i<cols;i++){
                this.weekHeaderTds[i].show();
            }
            let weekTdCols=this.weekTds.length;
            Ispaces.log.debug(this.classId+'.showWeek(): weekTdCols = '+weekTdCols);
            for(let i=0;i<weekTdCols;i++){
                this.weekTds[i].show();
            }
            this.showingDay=false;
        }
        this.weekDiv.show();
    }

    , showDay: function() {
        Ispaces.log.debug(this.classId+'.showDay()');
        if (this.monthDiv) this.monthDiv.hide();
        Ispaces.log.debug(this.classId+'.showDay(): this.showingDay = '+this.showingDay);
        /*
        if(this.showingDay){ // if we click the week button a second time, show the day
          this.showWeek();
          return;
        }
        if(!this.weekDiv){ // if the week has never been shown
          this.showWeek();
        }else{
          this.weekDiv.show();
        }
        if(this.showingDay||!this.weekDiv){ // if we click the week button a second time, show the day
          this.showWeek();
          if(this.showingDay){
            return;
          }
        }else{
          this.weekDiv.show();
        }
        */

        this.monthSelector.hide();
        this.weekSelector.hide();
        this.daySelector.show();
        this.buttonMonth.setClass('positive-notop-on');
        this.buttonWeek.setClass('positive-notop-on');
        this.buttonDay.setClass('positive-notop');


        /*
        let cols=this.daysInWeek;
        for(let i=0;i<cols;i++){
          if(i!=4){
            $('weekHeader'+i).hide();
          }
        }
        */
        let cols=this.weekHeaderTds.length;
        for(let i=0;i<cols;i++){
          this.weekHeaderTds[i].hide();
        }

        /*
        let weekTrCols=this.weekTrs.length;
        for(let i=0;i<weekTrCols;i++){
          alert('this.weekTrs['+i+'].hide()');
          this.weekTrs[i].hide();
        }
        */

        /*
        let weekCols=this.weekColgroups.length;
        alert('weekCols = '+weekCols);
        for(let i=0;i<weekCols;i++){
          alert('this.weekColgroups.['+i+'].hide()');
          this.weekColgroups[i].hide();
        }
        */

        ///*
        let weekTdCols=this.weekTds.length;
        Ispaces.log.debug(this.classId+'.showDay(): weekTdCols = '+weekTdCols);
        for(let i=0;i<weekTdCols;i++){
          this.weekTds[i].hide();
        }
        //*/
        this.showingDay=true;
    }

    , createMonthCalendar:function(){
        Ispaces.log.debug(this.classId+'.createMonthCalendar()');
        //Ispaces.log.alert(this.classId+'.createMonthCalendar()');
        //alert(this.classId+'.createMonthCalendar()');

        let ElementNames = Ispaces.Constants.ElementNames;

        let monthDiv = this.Create.createDiv().setClass('month-div');
        monthDiv.setHeightPercent(100);

        let monthTable = this.monthTable = Ispaces.Create.createHtmlTable(null,1);
        //this.monthTable.ba('#ccc');
        //this.monthTable.wiphip(100);
        this.monthTable.setClass('month');

        let tHead = this.Create.createElement(ElementNames.THEAD);

        let tableHeight = 7;
        let tr = this.Create.createElement(ElementNames.TR);

        for(let i = 0; i < this.daysInWeek; i++) {

            let th = this.Create.createElement(ElementNames.TH);
            //th.alCM();
            //th.wip(100/this.daysInWeek);
            //th.hi(this.heightDayHeader);
            th.add(this.Create.createText(this.DAYS_ABBR[i]));
            tr.add(th);
        }

        tHead.add(tr);
        monthTable.add(tHead);

        monthDiv.add(monthTable);

        return monthDiv;
    }

    , createWeekCalendar : function() {
        Ispaces.log.debug(this.classId+'.createWeekCalendar()');
        this.now = new Date();
        this.populateYearMonthDay();

        this.weekDiv = this.Create.createElement(Ispaces.Constants.ElementNames.DIV);

        this.weekHeaderTable=Ispaces.Create.createHtmlTable(null,1);
        this.weekHeaderTable.setClass('weekHeader');

        //let mainWH=Common.getWH(this.divMain);
        //let totalWidth=mainWH[0]-16-40;
        //this.headerWidth=Math.floor((totalWidth/this.daysInWeek));
        //this.headerWidthMiWi=this.headerWidth-33;

        //Ispaces.log.debug(this.classId+'.createWeekCalendar(): mainWH[0] = '+mainWH[0]);
        //Ispaces.log.debug(this.classId+'.createWeekCalendar(): totalWidth = '+totalWidth);
        //Ispaces.log.debug(this.classId+'.createWeekCalendar(): this.headerWidth = '+this.headerWidth);

        //this.refreshWeekHeader();

        let divScroll=this.Create.createDiv();
        let scrollbarWidth=getScrollbarWidth();
        Ispaces.log.debug(this.classId+'.createWeekCalendar(): scrollbarWidth = '+scrollbarWidth);
        //divScroll.wi((scrollbarWidth-1));
        //divScroll.hi(this.heightDayHeader);
        //divScroll.bo(CCC1);
        //divScroll.boW('1px 1px 1px 0');

        let weekHeaderTableDiv=this.Create.createCell(this.weekHeaderTable);
        //weekHeaderTableDiv.alT();
        let weekHeaderTableDivScroll=this.Create.createCell(divScroll);

        //weekHeaderTableDivScroll.wip(1);
        let weekHeaderTableDivRow = this.Create.createRow([weekHeaderTableDiv,weekHeaderTableDivScroll]);
        let weekHeaderTableDivTable=this.Create.createDivTable(weekHeaderTableDivRow);
        //weekHeaderTableDivTable.wip(100);

        this.weekDiv.add(weekHeaderTableDivTable);
        //this.weekDiv.owX(Ispaces.Constants.Properties.HIDDEN);
        this.divMain.add(this.weekDiv);

        this.weekTableDiv=this.Create.createDiv();
        //this.weekTableDiv.owX(Ispaces.Constants.Properties.HIDDEN);
        //this.weekTableDiv.owY(Ispaces.Constants.Properties.AUTO);
        //this.weekTableDiv.hi(mainWH[1]-this.heightDayHeader-2);
        this.addResizable(this.weekTableDiv);
        this.weekTableDiv.name='this.weekTableDiv';

        this.weekTable=Ispaces.Create.createHtmlTable(null,1);
        this.weekTable.setClass('week');

        this.weekTableDiv.add(this.weekTable);
        this.weekDiv.add(this.weekTableDiv);
        //this.weekDiv.name='this.weekDiv';

        this.refreshWeek();

    }

    , refreshWeekHeader : function(weekStartDate) {
        Ispaces.log.debug(this.classId+'.refreshWeekHeader('+weekStartDate+')');
        if(!weekStartDate){
          weekStartDate=this.getWeekStartDate();
        }
        Ispaces.log.debug(this.classId+'.refreshWeekHeader(): weekStartDate = '+weekStartDate);

        let month=this.month+1;
        let daysInMonth=this.getDaysInMonth();
        Ispaces.log.debug(this.classId+'.refreshWeekHeader(): daysInMonth = '+daysInMonth);

        let weekEndDate=weekStartDate+(this.daysInWeek-1);
        if(weekEndDate>daysInMonth){
          weekEndDate=weekEndDate-daysInMonth;
        }
        Ispaces.log.debug(this.classId+'.refreshWeekHeader(): weekEndDate = '+weekEndDate);

        let weekDate=weekStartDate;
        let tHead=this.Create.createElement(Ispaces.Constants.ElementNames.THEAD);
        let cols=this.daysInWeek;
        let tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);
        this.weekHeaderTds=[];
        for(let i=-1;i<cols;i++){
          let th=this.Create.createElement(Ispaces.Constants.ElementNames.TH);
          //td.id='weekHeader'+i;
          tr.add(th);

          if(i==-1){ // The time column

            let divTime=this.Create.createDiv();
            divTime.wi(33);
            //divTime.co('#6c6c6c');
            //divTime.ba(this.colorHeader);
            divTime.add(this.Create.createText(Ispaces.Constants.Characters.NBSP));
            th.wi(33);
            th.add(divTime);

          }else{

            if(weekDate>daysInMonth){
              weekDate=1;
              month+=1;
            }

            let divDay=this.Create.createDiv();
            //divDay.wi(this.headerWidth);
            divDay.miWi(this.headerWidthMiWi);
            //divDay.hi(33);
            divDay.fW('bold');
            divDay.fZ(14);
            //divDay.co('#6c6c6c'); // #6c6c6c, #40AF22
            //divDay.ba(F7F7F7);
            if(this.dateSelected==weekDate){
              th.setClass('today');
              //divDay.co(Ispaces.Constants.Colors.FFF);
              //divDay.co('#5d5d5d');
            }else{
              this.weekHeaderTds.push(th);
            }
            divDay.boW('1px 0 1px 0');
            //divDay.alC();
            //divDay.ma('8px 0 -8px 0');

            divDay.add(this.Create.createText(this.DAYS_ABBR[i]));
            //divDay.add(this.Create.createText(Ispaces.Constants.Characters.SPACE+weekDate++));

            //divDay.add(this.Create.createText(Ispaces.Constants.Characters.SPACE+this.getTh(weekDate++)));
            //divDay.add(this.Create.createText(Ispaces.Constants.Characters.SPACE+(weekDate++)+'/'+month));
            divDay.add(this.Create.createText(Ispaces.Constants.Characters.SPACE+(month)+'/'+(weekDate++)));


            th.hi(this.heightDayHeader);
            th.alCM();
            th.add(divDay);

          }
        }
        tHead.add(tr);
        //this.weekHeaderTable.add(tHead);

        let curHead=_(this.weekHeaderTable,Constants.ElementNames.THEAD);
        if(curHead&&curHead.length>0){
          Ispaces.log.debug(this.classId+'.refresh(): curHead = '+curHead);
          Ispaces.log.debug(this.classId+'.refresh(): curHead.length = '+curHead.length);
          //this.weekHeaderTable.replace(tHead,curHead[0]);
          this.weekHeaderTable.replaceFirst(tHead);
        }else{
          this.weekHeaderTable.add(tHead);
        }
    }

    , refreshWeek : function(weekStartDate) {
        Ispaces.log.debug(this.classId+'.refreshWeek('+weekStartDate+')');

        if(!this.weekHeaderTable) this.createWeekCalendar();

        if(!weekStartDate) weekStartDate=this.getWeekStartDate();

        let weekDate=weekStartDate;
        Ispaces.log.debug('weekDate = '+weekDate);

        this.refreshWeekHeader(weekStartDate);

        this.monthSelector.hide();
        this.weekSelector.show();
        if(this.monthDiv)this.monthDiv.hide();
        this.weekDiv.show();

        Ispaces.log.debug('this.apHeight = '+this.apHeight);
        let mainWH=Ispaces.Common.getWidthHeight(this.divMain);
        Ispaces.log.debug('mainWH[1] = '+mainWH[1]);

        let tBody = this.Create.createElement('tbody');

        let hourOfDay=11;
        let hour=hourOfDay;
        let cols=this.daysInWeek;
        let rows=24;
        let amPm='am';
        let isPm=false;
        let workDay=false;
        let newHour=false;
        let tdHeight=40;
        this.weekColgroups=[];
        this.weekTds=[];

        for(let i=0; i < rows; i++) {

            let tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);

            if(i==12){
                amPm='pm';
                isPm=true;
            }

            Ispaces.log.debug('hour = '+hour);

            hourOfDay = this.getNextHour(hourOfDay);

            let hourArray = [hourOfDay,amPm];
            hour = hourArray.join(Ispaces.Constants.Characters.EMPTY);
            tr.hourOfDay=hourOfDay;

            for(let j = -1; j < cols; j++) {

                let td=this.Create.createElement((j==-1) ? Ispaces.Constants.ElementNames.TH : Ispaces.Constants.ElementNames.TD);

                tr.add(td);
                td.setHeightPixels(tdHeight);
                let weekend=(j==0||j==(cols-1));
                let today=((j+weekStartDate)==this.date);


                if(j>-1&&!today) {
                    this.weekTds.push(td);
                }

                if(i==0) {

                    let colgroup=this.Create.createElement('colgroup');

                    if(j>-1&&!today){
                        colgroup.bo('#ffcc00 3px solid');
                    }

                    this.weekColgroups[j]=colgroup;
                    this.weekTable.add(colgroup);
                }

                if(j==-1) { // The time column

                    td.setHeightPercent(100);
                    td.setWidthPixels(33);

                    let divTime=this.Create.createDiv();
                    divTime.alTR();
                    divTime.fZ(10);
                    divTime.wi(33);
                    divTime.hi(tdHeight+1);
                    divTime.add(this.Create.createText(hour));
                    divTime.co('#6c6c6c');

                    td.add(divTime);

                }else{

                    if(today){
                        td.setClass('today');
                    }else{
                        td.setBackground(Ispaces.Constants.Colors.FFF)
                    }

                    let div0=this.Create.createDiv();
                    let div1=this.Create.createDiv();
                    if(weekend){
                        div0.boB('#ddd 1px dotted');
                    }else{
                        div0.boB('#ddd 1px dotted');
                    }

                    div0.setHeightPixels(tdHeight/2);
                    div0.add(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                    div1.setHeightPixels(tdHeight/2);
                    div1.add(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                    let div2=this.Create.createDiv();
                    div2.setMinWidthPixels(this.headerWidthMiWi);
                    div2.add(div0);
                    div2.add(div1);


                    td.add(div2);

                    td.dayOfWeek=this.DAYS[j];

                }

            } // for(let j = -1; j < cols; j++) {

            tBody.add(tr);

        } // for(let i=0; i < rows; i++) {

        //let curBody=_(this.weekTable,Constants.ElementNames.TBODY);
        let curBody = this.weekTable.getElementsByTagName(Ispaces.Constants.ElementNames.TBODY);

        if(curBody&&curBody.length>0){
            Ispaces.log.debug(this.classId+'.refresh(): curBody = '+curBody);
            Ispaces.log.debug(this.classId+'.refresh(): curBody.length = '+curBody.length);
            this.weekTable.replaceFirst(tBody);
            //this.weekTable.replace(this.tBodyWeek,curBody[0]);
        }else{
            this.weekTable.add(tBody);
            //this.weekTable.add(this.tBodyWeek);
        }

    } // refreshWeek : function(weekStartDate) {

    , refreshMonth : function() {
        Ispaces.log.debug(this.classId+'.refreshMonth()');
        let thisApplication = this;
        let Create = this.Create;

        let monthDate=new Date(this.year, this.month, 1);
        this.monthWeekday=monthDate.getDay();

        Ispaces.log.debug('monthDate = '+monthDate);
        Ispaces.log.debug('this.monthWeekday = '+this.monthWeekday);
        Ispaces.log.debug('this.entries.length = '+this.entries.length);

        this.weekStartDay=0;
        let offset=0;
        offset=(this.monthWeekday>=this.weekStartDay)?this.monthWeekday-this.weekStartDay:7-this.weekStartDay+this.monthWeekday;
        Ispaces.log.debug('offset = '+offset);

        let daysInMonth=this.getDaysInMonth();
        let daysInMonthPrev=this.DAYS_IN_MONTH[this.getMnthPrev(this.month)];

        Ispaces.log.debug('daysInMonth = '+daysInMonth);
        Ispaces.log.debug('daysInMonthPrev = '+daysInMonthPrev);

        let tBody = this.Create.createElement(Ispaces.Constants.ElementNames.TBODY);

        let dayOfMonth=0;

        // cols & rows (dynamic)
        let cols=this.daysInWeek;
        let daysCount=0;
        let rows=1;
        let daysInRowOne=this.daysInWeek-this.monthWeekday;
        Ispaces.log.debug('daysInRowOne = '+daysInRowOne);
        daysCount+=daysInRowOne;
        Ispaces.log.debug('daysCount = '+daysCount);
        while(daysCount<daysInMonth){
            daysCount+=this.daysInWeek;
            Ispaces.log.debug('daysCount = '+daysCount);
            rows++;
            Ispaces.log.debug('rows = '+rows);
        }
        Ispaces.log.debug('rows = '+rows);

        for(let i=0; i<rows; i++) {

            let tr = Create.createElement(Ispaces.Constants.ElementNames.TR);
            tBody.add(tr);

            for(let j=0; j<cols; j++) {

                let td = Create.createElement(Ispaces.Constants.ElementNames.TD);
                tr.add(td);

                let weekend=(j==0||j==(cols-1));

                if(weekend) {
                    td.setClass('weekend');
                    td.weekend=true;
                //}else{td.ba(Ispaces.Constants.Colors.FFF)}
                }

                if(
                  i==0&&j>=this.monthWeekday  // if it is the first row and j is greater than the day this month starts on
                  ||(i>0&&dayOfMonth<daysInMonth) // if it is any other row
                ) {

                    dayOfMonth++;
                    td.dayOfMonth=dayOfMonth;
                    td.dayOfWeek=this.DAYS[j];

                    //let calItems=getCalItemsByDayMonthYear
                    let calItems=this.getCalItemsByDay(dayOfMonth);

                    if(calItems && calItems.length>0){ // We have calendar entries

                        Ispaces.log.debug('calItems ='+calItems.length);
                        let calItemsDiv=this.createCalItemsDiv(calItems,td.dayOfMonth);
                        td.ow(Ispaces.Constants.Properties.HIDDEN);
                        td.add(calItemsDiv);
                        td.alighTop();

                    } else { // no entries

                        td.setFontWeight(Ispaces.Constants.Properties.BOLD);
                        td.alignCenterMiddle();
                        td.add(Create.createText(dayOfMonth));

                        td.addListener(
                          Ispaces.Constants.Events.MOUSEOVER
                          , function(){
                            //this.baco('#ffcc00',Constants.Colors.FFF);
                            //thisApplication.divDay.innerHTML=thisApplication.getDayTh(this.dayOfWeek,this.dayOfMonth);
                            this.setClass('weekend-on');
                          }
                        );

                        if(weekend) {

                          //td.mf(function(){this.baco(thisApplication.colorWeekend,OOO)})
                          td.addListener(
                              Ispaces.Constants.Events.MOUSEOUT
                            , function(){this.setClass('weekend')}
                          );

                        }else {

                          //td.mf(function(){this.baco(Ispaces.Constants.Colors.FFF,OOO)});
                          td.addListener(
                              Ispaces.Constants.Events.MOUSEOUT
                            , function(){this.setClass('off')}
                          );

                        }

                        //td.add(this.Create.createText(dayOfMonth));
                    }


                    /*
                    for(let i=0;i<this.entries.length;i++){
                    //Ispaces.log.alert('this.entries['+i+'] = '+this.entries[i]);
                    //Ispaces.log.alert('this.entries['+i+'].where = '+this.entries[i].where);
                    //let calItem=this.entries[i];
                    }
                    Ispaces.log.debug('calItem = '+calItem);
                    Ispaces.log.debug('calItem[\'where\'] = '+calItem['where']);
                    */
                    let today=(dayOfMonth==this.date&&this.monthSelected==this.month);
                    Ispaces.log.debug('dayOfMonth:'+dayOfMonth+', today = '+today);

                    if(today) {
                        Ispaces.log.debug('dayOfMonth:'+dayOfMonth+', today = '+today);
                        td.setClass('today');
                        //td.ba('#ffcc00');
                    }

                    //td.dc(function(){alert('dbllick')}); // double click

                    //td.oc(function(){
                    td.addListener(

                        Ispaces.Constants.Events.CLICK

                        , function(){

                          Ispaces.log.alert('td.oc()');

                          _td=this;

                          this.setBackground('red');
                          //this.mf(null);

                          let apWH = Ispaces.Common.getWidthHeight(thisApplication.divApplication);
                          let mainWH = Ispaces.Common.getWidthHeight(thisApplication.divMain);
                          let menuWH = Ispaces.Common.getWidthHeight(thisApplication.menu);

                          Ispaces.log.alert('td.oc(): apWH[1] = '+apWH[1]+', mainWH[1] = '+mainWH[1]+', menuWH[1] = '+menuWH[1]);

                          /*
                          let td=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          td.style.opacity='0.77';
                          td.ba('#333');
                          td.co(Ispaces.Constants.Colors.FFF);
                          td.wiphip(100,100);
                          let tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);
                          tr.add(td);
                          thisApplication.greyout=Common.Create.table();
                          thisApplication.greyout.wiphip(100,100);
                          thisApplication.greyout.add(tr);
                          //td.hi(apWH[1]);
                          thisApplication.greyout.rel(0,-(apWH[1]));
                          */
                          ///*
                          //thisApplication.greyout=this.Create.createDiv();
                          //thisApplication.greyout=this.create.tagClass(Ispaces.Constants.ElementNames.DIV,'greyout');
                          thisApplication.greyout = Create.createDiv().setClass('greyout');

                          //thisApplication.greyout.op(thisApplication.opacityGreyout,thisApplication.colorGreyout);

                          thisApplication.greyout.positionRelative(0, -(mainWH[1]));
                          thisApplication.greyout.setHeightPixels(mainWH[1]);
                          //*/

                          thisApplication.divApplication.add(thisApplication.greyout); // Add the greyout layer.
                          // Re-adjust the app height after adding the greyout layer.
                          //thisApplication.divApplication.ow(Ispaces.Constants.Properties.HIDDEN);
                          //thisApplication.divApplication.hi(apWH[1]);

                          thisApplication.disableResizing();

                          let options={
                            //top:'100px',
                            //left:'100px',
                            background : Ispaces.Constants.Colors.FFF,
                            //border:'#333 2px solid',
                            //border:'#353635 2px solid',
                            //border:'#333 1px solid',
                            //border:'#fff 1px solid',
                            border:'#A1A1A1 1px solid',

                            //margin:'20px',
                            //height:200,
                            //width:apWH[0]-50,
                            wip:40,
                            //width:Constants.Properties.AUTO,
                            //opacity:'0.88',
                            draggable:false,
                            maxable:false,

                            title:{
                                background : Ispaces.Constants.Colors.OOO
                              , color : Ispaces.Constants.Colors.FFF
                            }

                          };

                          //let modalWindow=new Window('addEvent','Add Event',options);
                          thisApplication.setDayOfMonth(this.dayOfMonth);
                          //let modalWindow=new Window('addEvent','Add Event: '+thisApplication.getDateTh(this.dayOfWeek,this.dayOfMonth),options);
                          let modalWindow = new ModalWindow('addEvent',thisApplication.getDateTh(this.dayOfWeek,this.dayOfMonth),options);

                          //modalWindow.addHideable(thisApplication.greyout);

                          // Inner class: Hideable.
                          let Hideable=function(ap,td){
                            this.ap=ap;
                            this.td=td;
                          };

                          Hideable.prototype.hide=function(){
                            this.ap.greyout.hide();
                            this.ap.centeringTable.hide();
                            this.ap.enableResizing();
                            if(this.td.weekend){
                              this.td.baco(EEE,OOO);
                              this.td.mf(function(){this.baco(EEE,OOO)});
                            }else{
                              this.td.baco(Ispaces.Constants.Colors.FFF,OOO);
                              this.td.mf(function(){this.baco(Ispaces.Constants.Colors.FFF,OOO)});
                            }
                          };

                          let hidethis=new Hideable(thisApplication,_td);
                          modalWindow.addHideable(hidethis);

                          let div = Create.createDiv();
                          div.setBackground(Ispaces.Constants.Colors.FFF);

                          //let formName='form-calendar-entry'_td;
                          let formName='form-calendar-entry'+_td.dayOfMonth;
                          //let form=this.create.tagId('form',formName);
                          let form = Create.createElement('form').setId(formName);
                          form.name=formName;

                          let year=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,YEAR,thisApplication.year);
                          let month=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,MONTH,thisApplication.month);
                          let day=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,DAY,this.dayOfMonth);
                          let what=Ispaces.ui.createFormElement('What','text','what',null);
                          let when=Ispaces.ui.createFormElement('When','text','when',null);
                          let where=Ispaces.ui.createFormElement('Where','text','where',null);
                          let notes=Ispaces.ui.createFormElement('Notes','text','notes',null);
                          //let save=Ispaces.ui.createFormElement(Ispaces.Constants.Characters.EMPTY,'button','save','Save');

                          /*
                          let inputWhat=cI('text','name','name');
                          let inputWhen=cI('text','when','name');
                          let inputWhere=cI('text','where','name');
                          let inputNotes=cI('text','notes',null);
                          */
                          let inputSave=Ispaces.ui.createInput('button','save','Save');

                          //inputSave.onclick=function(){alert('test')};
                          inputSave.oc(function(){

                            Ispaces.log.debug('inputSave.oc()');
                            Ispaces.log.debug('inputSave.oc(): modalWindow.id = '+ modalWindow.id);

                            /*
                            let fields=[YEAR,MONTH,DAY,'what','when','where','notes'];
                            //let calendarEntryObject=formToObject($('form-calendar-entry'),fields);
                            let calItemJson=formToObjectString(formName,fields);
                            Ispaces.log.alert('calItemJson = '+calItemJson);
                            //let calItem=JSON.parse(line);
                            let calItem=eval(Common.parens(calItemJson));
                            thisApplication.updateStore(thisApplication.entriesName,calItem);
                            */

                            let url=Ajax.serialize(form);
                            Ispaces.log.debug('url = '+url);
                            let baseUrl=contextUrl+Ispaces.Constants.Characters.FSLASH+this.objectId;
                            //Ispaces.log.alert(this.classId+'.doLogin(): baseUrl = '+baseUrl);
                            let qs=new Ispaces.QueryString();
                            //qs.append(form.action);
                            qs.append(thisApplication.objectId);
                            qs.append(QUESTION);
                            qs.append(url);
                            qs.add(TASKID,'save');
                            Ispaces.log.alert('qs.asString() = '+qs.asString());
                            let ajax=new Ispaces.Ajax(qs.asString(),function(r){thisApplication.processSave(r)});
                            ajax.doGet();


                        /*
                            //alert(calendarEntryObject.toJSONString());
                            //Ispaces.log.debug('calendarEntryObject.toJson(): '+calendarEntryObject.toJson());
                            //alert('calendarEntryObject.toJson().asString(): '+calendarEntryObject.toJson().asString());
                            let json=JSON.stringify(calendarEntryObject);
                            //Ispaces.log.debug('JSON.stringify(calendarEntryObject) = '+JSON.stringify(calendarEntryObject));
                            Ispaces.log.debug('json = '+json);

                            //let jsonObj=JSON.parse(json);
                            let jsonObj=JSON.parse(json, function (key, value) {
                                let d;
                                if (typeof value === 'string' &&
                                        value.slice(0, 5) === 'Date(' &&
                                        value.slice(-1) === ')') {
                                    d = new Date(value.slice(5, -1));
                                    if (d) {
                                        return d;
                                    }
                                }
                                alert('return '+value);
                                return value;
                            });

                            if(jsonObj){
                              alert('jsonObj');
                              alert('typeof jsonObj = '+typeof jsonObj);
                              alert('jsonObj.what = '+jsonObj.what);
                              alert('jsonObj[where] = '+jsonObj['where']);
                            }

                            //let cI=eval(line);
                            //let cI=JSON.parse(line);
                            let cI=JSON.parse(line, function (key, value) {
                                let d;
                                if (typeof value === 'string' &&
                                        value.slice(0, 5) === 'Date(' &&
                                        value.slice(-1) === ')') {
                                    d = new Date(value.slice(5, -1));
                                    if (d) {
                                        return d;
                                    }
                                }
                                alert('return '+value);
                                return value;
                            });
                            alert('cI = '+cI);
                            alert('typeof cI = '+typeof cI);
                            Ispaces.log.printObject(cI);
                            for(let n in cI){
                              Ispaces.log.debug('n = '+n);
                              //alert('calItem['+n+'] = '+calItem[n]);
                              //let v = calItem[n];
                              //alert(n+' = '+v);
                            }
                            if(cI){
                              alert('cI');
                              alert('typeof cI = '+typeof cI);
                              alert('cI.what = '+cI.what);
                              alert('cI[where] = '+cI['where']);
                            }

                            alert('thisApplication.store.get(\'entryCountName\') = "'+thisApplication.store.get(thisApplication.entryCountName)+'"');
                            thisApplication.entryCount=parseInt(thisApplication.getEntryCount());
                            alert('thisApplication.entryCount='+thisApplication.entryCount);
                            thisApplication.entryCount+=1;
                            thisApplication.store.set(thisApplication.entryCountName,(thisApplication.entryCount));
                            thisApplication.checkLocalStorage();
                            thisApplication.getEntries();

                        */

                            thisApplication.refreshMonth();
                            modalWindow.hide();
                          });

                          let tdSave=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdSave.add(inputSave);
                          //let save=Common.Create.tR([null,input])
                          //let save=Common.Create.tR([new Td(Ispaces.Constants.Characters.NBSP),input])
                          let tdNbsp=Ispaces.Create.createTableData(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                          let save=Ispaces.Create.createTableRow([tdNbsp,tdSave]);
                          //let save=Common.Create.tR([tdSave])

                          let eventTable=Ispaces.Create.createHtmlTable(2,0);
                          eventTable.setClass('calendarevent');
                        /*
                          let tdWhat=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdWhat.add(inputWhat);
                          let tdWhen=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdWhen.add(inputWhen);
                          let tdWhere=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdWhere.add(inputWhere);
                          let tdNotes=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdNotes.add(inputNotes);
                          let tdSave=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          tdSave.add(inputSave);
                          eventTable.aCnTR([tdWhat,tdWhen,tdWhere,tdNotes,tdSave]);
                        */
                          //eventTable.addAll([year,month,day,what,when,where,notes,save]);
                          eventTable.addAll([what,when,where,notes,save]);
                          form.addAll([year,month,day]);

                          //div.add(eventTable);
                          form.add(eventTable);
                          div.add(form);

                          modalWindow.addContent(div);
                          //modalWindow.window.bo('#ccc 1px solid');
                          //modalWindow.window.alCM();

                          thisApplication.centeringTable = Ispaces.Create.createHtmlTable(); // Table for centering
                          //thisApplication.centeringTable.wip(100);
                          //thisApplication.centeringTable.hi(mainWH[1]);
                          //thisApplication.centeringTable.rel(0,-(mainWH[1]*2));
                          let td=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                          //td.alCM();
                          //td.wip(100);
                          //td.hi(mainWH[1]);
                          let tr = Ispaces.Create.createTableRow(td);
                          thisApplication.centeringTable.add(tr);
                          tr.add(td);


                          /*
                          thisApplication.ap.add(modalWindow.window);
                          modalWindow.window.maT('25px');
                          modalWindow.window.rel(0,-(mainWH[1]*2));
                          */

                          td.add(modalWindow.window);
                          thisApplication.divApplication.add(thisApplication.centeringTable);

                        }

                        ,false
                    );

                }

                //tr.add(td);

            }  // for(let j=0; j<cols; j++) {

            //tBody.add(tr);

        } // for(let i=0; i<rows; i++) {

        //let curBody=_(this.monthTable,Constants.ElementNames.TBODY);
        let curBody=this.monthTable.getElementsByTagName(Ispaces.Constants.ElementNames.TBODY);
        //let currentTBody = null;
        //if(this.monthTable) currentTBody = this.monthTable.currentTBody;

        Ispaces.log.debug('curBody = '+curBody);

        if(curBody&&curBody.length>0){
        //if(currentTBody) {

            //Ispaces.log.alert('curBody = '+curBody);
            //Ispaces.log.debug('curBody.length = '+curBody.length);
            this.monthTable.replace(tBody, curBody[0]);
            //this.monthTable.replace(tBody, currentTBody);

            //let curBody2=_(this.monthTable,'tbody');
            //Ispaces.log.debug('curBody2 = '+curBody2);
            //Ispaces.log.debug('curBody2.length = '+curBody2.length);

        } else {
            //this.monthTable.currentTBody = tBody;
            this.monthTable.add(tBody);
        }

        //thisApplication=null;

    } // refreshMonth : function() {

    , processSave : function(r) {
        Ispaces.log.alert(this.classId+'.processSave('+r+')');
    }

    , disableResizing:function(){
        Ispaces.log.alert(this.classId+'.disableResizing()');
/*
for(let i=0;i<this.handles.length;i++){
  this.handles[i].disable();
}
*/
    }

    , enableResizing:function(){
        Ispaces.log.alert(this.classId+'.enableResizing()');
        /*
        for(let i=0;i<this.handles.length;i++){
          this.handles[i].enable();
        }
        */
    }

    , addResizable:function(resizable){
        Ispaces.log.debug(this.classId+'.addResizable()');
        /*
        for(let i=0;i<this.handles.length;i++){
          this.handles[i].addResizable(resizable);
        }
        */
    }

    , calculateHeight:function(){
        Ispaces.log.alert(this.classId+'.calculateHeight()');
        if (!viewableWH) viewableWH = getViewableWH();
        if (this.topMenu) if(!this.topMenu.widthHeight) this.topMenu.widthHeight = Common.getWH(this.topMenu);
        /*
        Ispaces.log.alert(this.id+'.calculateHeight(): viewableWH[0] = '+viewableWH[0]+', viewableWH[1] = '+viewableWH[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.topMenu.widthHeight[0] = '+this.topMenu.widthHeight[0]+', this.topMenu.widthHeight[1] = '+this.topMenu.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.bottomMenu.widthHeight[0] = '+this.bottomMenu.widthHeight[0]+', this.bottomMenu.widthHeight[1] = '+this.bottomMenu.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.widthHeight[0] = '+this.resizableWindow.titlebar.widthHeight[0]+', this.resizableWindow.titlebar.widthHeight[1] = '+this.resizableWindow.titlebar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.widthHeight[0] = '+taskbar.widthHeight[0]+', taskbar.widthHeight[1] = '+taskbar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.divTable.widthHeight[0] = '+taskbar.divTable.widthHeight[0]+', taskbar.divTable.widthHeight[1] = '+taskbar.divTable.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.autoHiding = '+taskbar.autoHiding);
        */

        let h = viewableWH[1];
        if (this.topMenu) h -= this.topMenu.widthHeight[1];
        h -= this.resizableWindow.titlebar.widthHeight[1];
        h -= 3; // Back the bottom off a little.
        //Ispaces.log.alert(this.id+'.calculateHeight(): h='+h);
        //return {w:w,h:h};
        //return {w:windowWH[0],h:h};
        return {w:viewableWH[0],h:h};
    }

    , calculateAppDivHeight:function(){
        Ispaces.log.alert(this.classId+'.calculateAppDivHeight()');
        if (!viewableWH) viewableWH = getViewableWH();
        /*
        Ispaces.log.alert(this.id+'.calculateAppDivHeight(): viewableWH[0] = '+viewableWH[0]+', viewableWH[1] = '+viewableWH[1]);
        Ispaces.log.alert(this.id+'.calculateAppDivHeight(): this.topMenu.widthHeight[0] = '+this.topMenu.widthHeight[0]+', this.topMenu.widthHeight[1] = '+this.topMenu.widthHeight[1]);
        */
        let h = viewableWH[1];
        h -= this.resizableWindow.titlebar.widthHeight[1];
        //Ispaces.log.alert(this.id+'.calculateAppDivHeight(): h='+h);
        return { w: viewableWH[0], h: h };
    }

    , calculateHalfHeight:function(){
        Ispaces.log.alert(this.classId+'.calculateHalfHeight()');
        if (!viewableWH) viewableWH = getViewableWH();
        if (this.topMenu) if(!this.topMenu.widthHeight) this.topMenu.widthHeight = Common.getWH(this.topMenu);
        let h = viewableWH[1];
        h = h/2;
        if (this.topMenu) h -= this.topMenu.widthHeight[1];
        h -= this.resizableWindow.titlebar.widthHeight[1];
        //Ispaces.log.alert(this.id+'.calculateHalfHeight(): h='+h);
        return {w:viewableWH[0],h:h};
    }

    , calculateAppDivHalfHeight:function(){
        Ispaces.log.alert(this.classId+'.calculateAppDivHalfHeight()');
        if(!viewableWH)viewableWH=getViewableWH();
        let h = viewableWH[1];
        h = h/2;
        h -= this.resizableWindow.titlebar.widthHeight[1];
        //Ispaces.log.alert(this.id+'.calculateAppDivHalfHeight(): h='+h);
        return { w: viewableWH[0], h: h };
    }

    , calculateHalfWidth:function(){
        Ispaces.log.alert(this.classId+'.calculateHalfWidth()');
        if(!viewableWH)viewableWH=getViewableWH();
        if(this.topMenu)if(!this.topMenu.widthHeight)this.topMenu.widthHeight=Common.getWH(this.topMenu);
        /*
        Ispaces.log.alert(this.id+'.calculateHalfWidth(): windowWH[0] = '+windowWH[0]+', windowWH[1] = '+windowWH[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.bottomMenu.widthHeight[0] = '+this.bottomMenu.widthHeight[0]+', this.bottomMenu.widthHeight[1] = '+this.bottomMenu.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.widthHeight[0] = '+this.resizableWindow.titlebar.widthHeight[0]+', this.resizableWindow.titlebar.widthHeight[1] = '+this.resizableWindow.titlebar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.widthHeight[0] = '+taskbar.widthHeight[0]+', taskbar.widthHeight[1] = '+taskbar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.divTable.widthHeight[0] = '+taskbar.divTable.widthHeight[0]+', taskbar.divTable.widthHeight[1] = '+taskbar.divTable.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHalfWidth(): taskbar.autoHiding = '+taskbar.autoHiding);
        */
        let h = viewableWH[1];
        if (this.topMenu) h -= this.topMenu.widthHeight[1];
        h -= this.resizableWindow.titlebar.widthHeight[1];
        h -= 3; // Back the bottom off a little.
        //Ispaces.log.alert(this.id+'.calculateHeight(): h='+h);
        let wi = viewableWH[0];
        wi = wi/2;
        //Ispaces.log.alert(this.id+'.calculateHalfWidth(): wi = '+wi);
        return { w: wi, h: h };
    }

    , calculateAppDivHalfWidth:function(){
        Ispaces.log.alert(this.classId+'.calculateAppDivHalfWidth()');
        if(!viewableWH)viewableWH=getViewableWH();
        /*
        Ispaces.log.alert(this.id+'.calculateHalfWidth(): windowWH[0] = '+windowWH[0]+', windowWH[1] = '+windowWH[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.bottomMenu.widthHeight[0] = '+this.bottomMenu.widthHeight[0]+', this.bottomMenu.widthHeight[1] = '+this.bottomMenu.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.widthHeight[0] = '+this.resizableWindow.titlebar.widthHeight[0]+', this.resizableWindow.titlebar.widthHeight[1] = '+this.resizableWindow.titlebar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.widthHeight[0] = '+taskbar.widthHeight[0]+', taskbar.widthHeight[1] = '+taskbar.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHeight(): taskbar.divTable.widthHeight[0] = '+taskbar.divTable.widthHeight[0]+', taskbar.divTable.widthHeight[1] = '+taskbar.divTable.widthHeight[1]);
        Ispaces.log.alert(this.id+'.calculateHalfWidth(): taskbar.autoHiding = '+taskbar.autoHiding);
        */
        let h = viewableWH[1];
        h -= this.resizableWindow.titlebar.widthHeight[1];
        h -= 3; // Back the bottom off a little.
        //Ispaces.log.alert(this.id+'.calculateHeight(): h='+h);
        let wi = viewableWH[0];
        wi = wi/2;
        //Ispaces.log.alert(this.id+'.calculateHalfWidth(): wi = '+wi);
        return { w: wi, h: h };
    }

    , maximize: function() {
        //Ispaces.log.debug(this.classId+'.maximize()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);
        /*
        this.iframe.widthHeight=Common.getWH(this.iframe); // Save the iframe width/height for restore.
        */
        /*
        Ispaces.log.alert(this.id+'.maximize(): this.divApplication.widthHeight[0] = '+this.divApplication.widthHeight[0]+', this.divApplication.widthHeight[1] = '+this.divApplication.widthHeight[1]);
        Ispaces.log.alert(this.id+'.maximize(): this.divMain.widthHeight[0] = '+this.divMain.widthHeight[0]+', this.divMain.widthHeight[1] = '+this.divMain.widthHeight[1]);
        Ispaces.log.alert(this.id+'.maximize(): this.iframe.widthHeight[0]='+this.iframe.widthHeight[0]+', this.iframe.widthHeight[1]='+this.iframe.widthHeight[1]);
        */
        let widthHeight=this.calculateHeight();
        //this.iframe.wihi(widthHeight[0],widthHeight[1]);
        this.divMain.wihi(widthHeight[0], widthHeight[1]);
        //this.divApplication.wihi(widthHeight[0],widthHeight[1]);

        let divApplicationHeight=this.calculateAppDivHeight();
        this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h);

        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    }

    , restore:function(){
        //Ispaces.log.debug(this.classId+'.restore()');
        //this.showHandles();
        //this.iframe.wihi(this.iframe.widthHeight[0],this.iframe.widthHeight[1]);
        this.divApplication.wihi(this.divApplication.widthHeight[0],this.divApplication.widthHeight[1]);
        //this.divApplication.wi(this.divApplication.widthHeight[0]);
        this.divMain.wihi(this.divMain.widthHeight[0],this.divMain.widthHeight[1]);
        /*
        Ispaces.log.alert(this.id+'.restore(): this.divApplication.widthHeight[0] = '+this.divApplication.widthHeight[0]+', this.divApplication.widthHeight[1] = '+this.divApplication.widthHeight[1]);
        Ispaces.log.alert(this.id+'.restore(): this.divMain.widthHeight[0] = '+this.divMain.widthHeight[0]+', this.divMain.widthHeight[1] = '+this.divMain.widthHeight[1]);
        */
        this.draggableAp.addMouseDown(); // Re-add the ability to drag the window.
        this.padHandles=true;
    }

    , snapTop : function() {
        //Ispaces.log.debug(this.classId+'.snapTop()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);
        /*
        Ispaces.log.alert(this.id+'.snapTop(): this.divApplication.widthHeight[0] = '+this.divApplication.widthHeight[0]+', this.divApplication.widthHeight[1] = '+this.divApplication.widthHeight[1]);
        Ispaces.log.alert(this.id+'.snapTop(): this.divMain.widthHeight[0] = '+this.divMain.widthHeight[0]+', this.divMain.widthHeight[1] = '+this.divMain.widthHeight[1]);
        */
        let widthHeight=this.calculateHalfHeight();
        this.divMain.wihi(widthHeight[0],widthHeight[1]);

        let divApplicationHeight=this.calculateAppDivHalfHeight();
        this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h);

        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

    , snapBottom:function(){
        //Ispaces.log.debug(this.classId+'.snapBottom()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);
        let widthHeight=this.calculateHalfHeight();
        this.divMain.wihi(widthHeight[0],widthHeight[1]-3); // Back the bottom off a little because of the shadow.
        let divApplicationHeight=this.calculateAppDivHalfHeight();
        this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

    , snapLeft:function(){
        //Ispaces.log.debug(this.classId+'.snapLeft()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);
        let widthHeight=this.calculateHalfWidth();
        this.divMain.wihi(widthHeight[0],widthHeight[1]-3); // Back the bottom off a little because of the shadow.
        let divApplicationHeight=this.calculateAppDivHalfWidth();
        this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

    , snapRight:function(){
        //Ispaces.log.debug(this.classId+'.snapRight()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);
        let widthHeight=this.calculateHalfWidth();
        this.divMain.wihi(widthHeight[0],widthHeight[1]-3); // Back the bottom off a little because of the shadow.
        let divApplicationHeight=this.calculateAppDivHalfWidth();
        this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

    , snapTopLeft:function(){
        //Ispaces.log.debug(this.classId+'.snapTopLeft()');
        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);

        let w=this.calculateHalfWidth();
        let h=this.calculateHalfHeight();
        this.divMain.wihi(w.w,h.h);

        let divApplicationWidth=this.calculateAppDivHalfWidth();
        let divApplicationHeight=this.calculateAppDivHalfHeight();
        this.divApplication.wihi(divApplicationWidth.w,divApplicationHeight.h);

        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

    , snapTopRight:function(){
        //Ispaces.log.debug(this.classId+'.snapTopRight()');

        this.divApplication.widthHeight=Common.getWH(this.divApplication);
        this.divMain.widthHeight=Common.getWH(this.divMain);

        let w=this.calculateHalfWidth();
        let h=this.calculateHalfHeight();
        this.divMain.wihi(w.w,h.h);

        let divApplicationWidth=this.calculateAppDivHalfWidth();
        let divApplicationHeight=this.calculateAppDivHalfHeight();
        this.divApplication.wihi(divApplicationWidth.w,divApplicationHeight.h);

        this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        this.padHandles=false;
    }

/*
,hideHandles:function(){
Ispaces.log.debug(this.classId+'.hideHandles()');
Ispaces.log.debug(this.classId+'.hideHandles(): this.handles.length = '+this.handles.length);
for(let i=0;i<this.handles.length;i++){
  this.handles[i].hide();
  //this.s.hi(0);
}
}

,showHandles:function(){
Ispaces.log.debug(this.classId+'.showHandles()');
//Ispaces.log.alert(this.classId+'.showHandles(): this.handles.length = '+this.handles.length);
for(let i=0;i<this.handles.length;i++){
  this.handles[i].show();
}
}
*/

    , getDateTh:function(dayOfWeek,dayOfMonth){
        Ispaces.log.debug(this.classId+'.getDateTh('+dayOfWeek+','+dayOfMonth+')');
        let sb = new Ispaces.StringBuilder();
        sb.append(dayOfWeek);
        sb.append(COMMASPACE);
        sb.append(this.getMnth());
        sb.append(Ispaces.Constants.Characters.SPACE);
        sb.append(this.getTh(dayOfMonth));
        sb.append(Ispaces.Constants.Characters.SPACE);
        sb.append(this.year);
        Ispaces.log.debug(this.classId+'.getDateTh('+dayOfWeek+','+dayOfMonth+') = '+sb.asString());
        return sb.asString();
    }

    , getDayTh:function(dayOfWeek,dayOfMonth){
        Ispaces.log.debug(this.classId+'.getDayTh('+dayOfWeek+','+dayOfMonth+')');
        let sb = new Ispaces.StringBuilder();
        sb.append(dayOfWeek);
        sb.append(Ispaces.Constants.Characters.SPACE);
        sb.append(this.getTh(dayOfMonth));
        Ispaces.log.debug(this.classId+'.getDayTh('+dayOfWeek+','+dayOfMonth+') = '+sb.asString());
        return sb.asString();
    }

    , getTh:function(dayOfMonth){
        Ispaces.log.debug(this.classId+'.getTh('+dayOfMonth+')');
        let sb = new Ispaces.StringBuilder();
        sb.append(dayOfMonth);
        switch(dayOfMonth){
          case 1:
          case 21:
          case 31:
            sb.append(ST);break;
          case 2:
          case 22:
            sb.append(ND);break;
          case 3:
          case 23:
            sb.append(RD);break;
          default:
            sb.append(Ispaces.Constants.ElementNames.TH);
        }
        Ispaces.log.debug(this.classId+'.getTh('+dayOfMonth+') = '+sb.asString());
        return sb.asString();
    }

///*
    , getDaysInMonth:function(){
        Ispaces.log.debug(this.classId+'.getDaysInMonth()');
        let daysInMonth=this.DAYS_IN_MONTH[this.month];
        if(this.month==1&&((this.year%4 == 0)&&(this.year%100!= 0))||(this.year%400==0)){
          daysInMonth=29;
        }
        return daysInMonth;
    }
//*/
/* Using a switch statement to get days of month
getDaysInMonth:function(){
Ispaces.log.debug(this.classId+'.getDaysInMonth()');
let days=0;
switch(this.month){
  case 1:case 3:case 5:case 8:case 10:case 12:days=31;break;
  case 4:case 6:case 9:case 11:days=30;break;
  case 2:
    if(((year%4==0)&&!(year%100==0))||(year%400==0)){
      days = 29;
    }else{
      days = 28;
    }
    break;
  default:
    days=0;
    break;
}
return days;
}
*/

    , getEntryCount:function(){
        Ispaces.log.debug(this.classId+'.getEntryCount()');
        /*
        let entryCount=this.store.get(this.entryCountName);
        Ispaces.log.debug(this.classId+'.getEntryCount(): entryCount = "'+entryCount+'"');
        //if(entryCount&&(!entryCount==NaN)){
        if(entryCount){
          return parseInt(entryCount);
        }else{
          return 0;
        }
        */
    }

    , getEntries:function(){
        Ispaces.log.debug(this.classId+'.getEntries()');
        Ispaces.log.debug(this.classId+'.getEntries(): this.entryCount = '+this.entryCount);
        for(let i=0;i<this.entryCount;i++){
          Ispaces.log.debug(this.classId+'.getEntries(): entry'+i);
          /*
          this.store.get('entry'+i,function(ok,val){
            if(ok){
              Ispaces.log.error(this.classId+'.getEntries(): entry'+i+', val = ' + val);
              if(!isNull(val)){
                Ispaces.log.debug(this.classId+'.getEntries(): isNull(val) = ' + (isNull(val)));
                //let entry=JSON.parse(val);
                let entry=eval(Common.parens(val));
                //Ispaces.log.error(this.classId+'.getEntries(): entry'+i+', entry = '+entry);
                //Ispaces.log.error(this.classId+'.getEntries(): entry'+i+', typeof entry = '+typeof entry);
                //Ispaces.log.printObject(entry);
                //for(let n in entry){
                  //Ispaces.log.debug('n = '+n);
                  //alert('entry['+n+'] = '+entry[n]);
                  //let v = entry[n];
                  //alert(n+' = '+v);
                //}
                //for(let object
                //Ispaces.log.error(this.classId+'.getEntries(): entry'+i+', entry.what = '+entry.what);
                //Ispaces.log.error(this.classId+'.getEntries(): entry'+i+', entry.when = '+entry.when);
                Ispaces.log.debug(this.classId+'.getEntries(): entry'+i+', entry[where] = '+entry['where']);
              }
            }
          });
          */
        }
    }

    , createCalItemsDiv:function(calItems,day){
        Ispaces.log.debug(this.classId+'.createCalItemsDiv('+calItems+')');
        Ispaces.log.debug(this.classId+'.createCalItemsDiv('+calItems+'): calItems.length = '+calItems.length);

        let bgColor='#fff888';
        //let bgColor='#FFD324';
        //let bgColor='#ffee88';
        let color='#333';

        let outerDiv=this.Create.createDiv();
        //outerDiv.bo('green 1px solid');
        outerDiv.alT();
        //outerDiv.wiphip(100);
        //outerDiv.ow(Ispaces.Constants.Properties.HIDDEN);
        let dayDiv=this.Create.createDiv();
        //dayDiv.ba(ORANGE);
        //dayDiv.ba('#ffcc00');
        //dayDiv.baco('#ffcc00','#fff');
        //dayDiv.baco('#fffccc','#fff');
        dayDiv.baco(bgColor,color);
        dayDiv.fW(Ispaces.Constants.Properties.BOLD);
        dayDiv.pa('0 0 0 2px');
        dayDiv.add(this.Create.createText(day));
        outerDiv.add(dayDiv);
        //outerDiv.ma('1px');
        for(let i=0;i<calItems.length;i++){
          let innerDiv=this.Create.createDiv();
          innerDiv.bo(bgColor+' 1px solid');
          //innerDiv.ma('1px');
          let calItemDiv=this.createCalItemDiv(calItems[i]);
          calItemDiv.hide();
          let calItemSummary=this.getCalItemSummary(calItems[i]);
          innerDiv.add(this.Create.createText(calItemSummary));
          innerDiv.add(calItemDiv);
          //div.hide();
          outerDiv.add(innerDiv);
        }
        return outerDiv;
    }

    , getCalItemSummary:function(calItem){
        let sb=new Ispaces.StringBuilder();
        sb.append(calItem.what);
        sb.append(', ');
        sb.append(calItem.when);
        sb.append(' at ');
        sb.append(calItem.where);
        return sb.asString()
    }

    , createCalItemDiv:function(calItem){
        Ispaces.log.debug(this.classId+'.createCalItemDiv('+calItem+')');
        Ispaces.log.debug(this.classId+'.createCalItemDiv('+calItem+'): calItem.what = '+calItem.what);
        let div=this.Create.createDiv();
        let what=this.Create.createText(calItem.what);
        let when=this.Create.createText(calItem.when);
        let where=this.Create.createText(calItem.where);
        let notes=this.Create.createText(calItem.notes);
        div.add(what);
        div.add(this.Create.createText('\n'));
        div.add(when);
        div.add(this.Create.createText('\n'));
        div.add(where);
        div.add(this.Create.createText('\n'));
        div.add(notes);
        return div;
    }

    , getCalItemsByDay:function(dayOfMonth){
        Ispaces.log.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+')');
        Ispaces.log.debug(this.classId+'.getCalItemsByDay(): this.entries.length = '+this.entries.length);
        let calItems=[];
        for(let i=0;i<this.entries.length;i++){
          let calItem=this.entries[i];
          //Ispaces.log.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+'): calItem[\'what\'] = '+calItem['what']);
          //Ispaces.log.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+'): calItem[\'day\'] = '+calItem['day']);
          if(calItem[YEAR]==this.year){
            if(calItem[MONTH]==this.month){
              if(calItem[DAY]==dayOfMonth){
                calItems.push(calItem);
              }
            }
          }
        }
        return calItems;
    }

    , addEntry:function(o){
        this.entries.push(o);
    }

    //updateEntries:function(o,id){
    , updateStore:function(id,o){
        Ispaces.log.alert(this.classId+'.updateStore:('+id+',o)');
        Ispaces.log.debug(this.classId+'.updateStore:('+id+',o): this.entries = '+this.entries.length);
        this.addEntry(o);
        Ispaces.log.debug(this.classId+'.updateStore:('+id+',o): this.entries = '+this.entries.length);
        let json=JSON.stringify(this.entries);
        Ispaces.log.alert(this.classId+'.updateStore:('+id+',o): json = '+json);
        Ispaces.log.debug(this.classId+'.updateStore:('+id+',o): this.store.set(id,json)');
        //this.store.set(id,json);
    }

    , showEntries: function() {
        Ispaces.log.debug(this.classId+'.showEntries()');
        //let entries=this.store.get('entries');
        let thisApplication=this;
        let entries=null;
        /*
        this.store.get(this.entriesName,function(ok,val){
          if(ok){
            //Ispaces.log.debug(this.classId+'.showEntries(): val = '+val);
            Ispaces.log.debug('.showEntries(): val = '+val);
            if(val){
              entries=val;
              Ispaces.log.debug('.showEntries(): entries = '+entries);
              thisApplication.entries=JSON.parse(entries);
            }
          }
        });
        */
        Ispaces.log.debug(this.classId+'.showEntries(): entries = '+entries);

        if (entries) {
              //let jsonArray=JSON.parse(entries);
              let jsonArray=eval(Common.parens(entries));
              this.entries=jsonArray;
              if(jsonArray){
                Ispaces.log.debug(this.classId+'.showEntries(): jsonArray = '+jsonArray);
                Ispaces.log.debug(this.classId+'.showEntries(): typeof jsonArray = '+typeof jsonArray);
                Ispaces.log.debug(this.classId+'.showEntries(): jsonArray.length = '+jsonArray.length);
              }
        }
        thisApplication=null;
    }

    , removeEntries: function() {
        Ispaces.log.debug(this.classId+'.removeEntries()');
        //this.store.remove(this.entriesName);
        /*
        Ispaces.log.debug(this.classId+'.removeEntries(): this.entryCount = '+this.entryCount);
        for(let i=0;i<this.entryCount;i++){
          Ispaces.log.debug(this.classId+'.removeEntries(): entry'+i);
          this.store.remove('entry'+i,function(ok,val){
            if(ok){
              Ispaces.log.error(this.classId+'.removeEntries(): REMOVED entry'+i+', val = ' + val);
            }
          });
        }
        this.entryCount=0;
        this.store.set(this.entryCountName,(this.entryCount));
        */
    }

    , drag: function(x,y,draggable) {
        Ispaces.log.debug(this.id+'.drag('+x+', '+y+', '+draggable+')');
        let windowDiv=this.windowDiv;
        let windowXY = windowDiv._xy
        , windowWH = windowDiv._wh
        ;
        if(!windowXY) windowXY=windowDiv._xy=Common.getXY(windowDiv);
        if(!windowWH) windowWH=windowDiv._wh=Common.getWH(windowDiv);

        let windowX = windowXY[0]
        , windowY = windowXY[1]
        , windowW = windowWH[0]
        , windowH = windowWH[1]
        ;

        if (
          (x>windowX)
          &&(x<(windowX+windowW))
          &&(y>windowY)
          &&(y<(windowY+windowH))
        ) {
            if (!this.isOver) {
                this.isOver=true;
                this.mouseEnter(draggable);
            }
            return true; // handled!
        } else if (this.isOver) {
            this.isOver = false;
        }
        return false; // not handled!
    }

    , mouseEnter: function(draggable) {
        Ispaces.log.debug(this.id+'.mouseEnter(draggable:'+draggable+')');
        draggable.rowBottom.hide();
        draggable.isOverDesktop=false;
    }

    /*
    , destroySave: function(eventObject) {
        Ispaces.log.debug(this.classId+'.destroySave('+eventObject+')');
        this.resizableWindow.hide(); // First off hide the window.. Calls ResizableWindow.windowDiv.hid()
        if(eventObject) Ispaces.Events.stopEvent(eventObject);
        let id = this.id;
        //new Ispaces.AsyncApply(this,this.destroy,null,50);
        new Ispaces.AsyncCall(this,this.destroy,50);
    }

    , destroy: function() {
        Ispaces.log.debug(this.classId+'.destroy()');
        this.resizableWindow.destroyWindow();
        Ispaces.spaces.space.removeAp(this);
        Ispaces.spaces.space.store.remove(this.id);
        for (let p in this) {
            this[p] = null;
            delete this[p];
        }
    }
    */

    , setWidthPixels: function(w) {
        Ispaces.log.debug(this.id+'.setWidthPixels('+w+')');
        this.divMain.setWidthPixels(w);
        this.divApplication.setWidthPixels(w);
    }

    , setHeightPixels: function(h) {
        Ispaces.log.debug(this.id+'.setHeightPixels('+h+')');
        this.divMain.setHeightPixels(h-33);
        this.divApplication.setHeightPixels(h);
    }

});

Ispaces.CalendarApplication.start = function(config) {
    Ispaces.log.debug('Ispaces.CalendarApplication.start('+config+')');
    let calendarApplication = new Ispaces.CalendarApplication(config);
    //window['ispacesCalendar'] = calendarApplication;
    calendarApplication.init();
    return calendarApplication;
};
