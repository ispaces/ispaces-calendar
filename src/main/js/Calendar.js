//Ispaces.Calendar = function(config) {
//Ispaces['Calendar'] = function(config) {
Ispaces.Calendar = Ispaces['Calendar'] = function(config) {
    console.log('Ispaces.Calendar('+config+')');
    //alert('Calendar('+config+')');

    this.configure(config);
    this.init();
};

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

Ispaces.Common.extend(

    Ispaces.Calendar.prototype

    , {

          classId: 'Calendar'
    
        , appName: 'Calendar'

        , title : 'Calendar'

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

            var Constants = Ispaces.Constants
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

            var Events = Ispaces.Constants.Events;

            return {
                CLICK       : Events.CLICK
              , MOUSEUP     : Events.MOUSEUP
              , MOUSEDOWN   : Events.MOUSEDOWN
              , MOUSEMOVE   : Events.MOUSEMOVE
              , CONTEXTMENU : Events.CONTEXTMENU
            }

        })()

        , configure: function(config) {  // the config object can be passed to this configure the application
            Ispaces.logger.debug(this.classId+'.configure('+config+')');

            this.id = new Ispaces.StringBuilder([
                this.classId
              , Ispaces.Constants.Characters.UNDERSCORE
              , this.instanceId  // The instanceId gets set in the super class Ispaces.Persistable.
            ]).asString();

            Ispaces.logger.debug('this.id = '+this.id);

            if(config) {
                this.config = config;
                this.contextUrl = config.contextUrl;
                this.backendUrl = config.backendUrl;
                //this.instagramAccessToken = config.instagramAccessToken;
                //this.instagramUsername = config.instagramUsername;
                Ispaces.logger.debug('this.contextUrl = '+this.contextUrl);
                Ispaces.logger.debug('this.backendUrl = '+this.backendUrl);

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
            //alert(this.id+'.init()');
            Ispaces.logger.debug(this.id+'.init()');

            //this.divApplication = this.createApplication().setClass(this.classId); // Create the application div.
            this.divApplication = this.createApplication(); // Create the application div.

            //_this.setDimensions(); // A call to set the dimensions of the window after it has been built and added to the DOM.

            Ispaces.logger.debug(this.id+'.init(): this.divApplication = '+this.divApplication);
            //Ispaces.logger.alert(this.id+'.init(): this.divApplication = '+this.divApplication);

            body.add(this.divApplication);

            //this.populateData();

            this.monthDiv = this.createMonthCalendar();
            this.divMain.add(this.monthDiv);

            this.refreshMonth();

            //_this.setDimensions(); // A call to set the dimensions of the window after it has been built and added to the DOM.
        }


        , setDimensions: function() {
            Ispaces.logger.debug(this.id+'.setDimensions()');
            //alert(this.id+'.setDimensions()');

            var windowWidth = window.innerWidth;
            Ispaces.logger.debug('windowWidth = '+windowWidth);
            //Ispaces.logger.alert('windowWidth = '+windowWidth);

            var windowHeight = window.innerHeight;
            Ispaces.logger.debug('windowHeight = '+windowHeight);
            //alert('windowHeight = '+windowHeight);
        }

        , createApplication: function() {
            //alert('createApplication()');

            var Create = this.Create
            , createDiv = Create.createDiv
            , createCell = Create.createCell
            , createRow = Create.createRow
            , createDivTable = Create.createDivTable
            , createText = Create.createText
            , createTextI18n = Create.createTextI18n
            ;

            //var divMain=this.createMain();

            Ispaces.logger.debug(this.classId+'.createApplication('+id+')');

            var _this=this
            , Create = this.Create
            , createDivCell = Create.createDivCell
            , createDivRow = Create.createDivRow
            , createDivTable = Create.createDivTable
            ;

            /*
             * Create the ResizableWindow setting a reference to this.resizableWindow.
             * Order is especially important here, in that the DraggableApplication required the reference to 'this.resizableWindow' to be set.
             */
            var resizableWindow = this.resizableWindow = new Ispaces.ResizableWindow(this); // DraggableApplication requires this.resizableWindow
            var titlebar=resizableWindow.createTitlebar();  // Some applications might not want the titlebar. Leave it up to the application to decide if it wants to create one.
            
            //new Ispaces.DraggableApplication(_this,titlebar);

            var cellTitlebar=createDivCell(titlebar)
            ,rowTitlebar=createDivRow(cellTitlebar)
            ;

  //resizableWindow.setTitlebarHeight(33);
  //resizableWindow.titlebar.bo(0);
  //resizableWindow.titlebar.ba('transparent');

            this.menu = this.createMenu();

            var divMain = this.divMain = this.createMain()
            , cellMain = createDivCell(divMain).setClass("cell-main")
            , rowMain = createDivRow(cellMain)

            divMain.setHeightPercent(100);
            cellMain.setHeightPercent(100);
            rowMain.setHeightPercent(100);

            /*
            var bottomMenu = this.createBottomMenu()
            , cellBottom = createDivCell(bottomMenu)
            , tableBottom = createDivTable(createDivRow(cellBottom))
            , rowBottom = createDivRow(tableBottom)
            ;
            */

    //this.divApplication.addAll([this.menu,this.divMain]);

            var divTable = this.divTable = Create.createDivTable([
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
            //var height=33;
            //rowBottom.setHeightPixels(height),rowBottom.setMaxHeight(height);
            divTable.setWidthHeightPercent(100);
            divTable.setOverflow(Ispaces.Constants.Properties.HIDDEN);

            //return Create.createDiv(divTable);
            return Create.createDiv(divTable).setHeightPercent(100);

        //} // createApplication()

            //var divMain = this.divMain = createDiv([
            var divMainTable = createDivTable([
                createRow(divTableInstagramApiWidget)
              , createRow(divTableOutput)
            ]);

            var divMain = this.divMain = createDiv(divMainTable).setClass('panel-body');

            var divTable = createDiv([
                divHeader
              , divMain
            ]).setClass('panel panel-primary');

            var divTableContainer = createDivTable(createCell(divTable)).setClass('container-fluid');
            divMainTable.setWidthHeightPercent(100);
            divTableContainer.setWidthHeightPercent(100);

            //return divTable
            return divTableContainer
        }


        , createMain : function() {

            Ispaces.logger.debug(this.classId+'.createMain()');

            //var main=this.Create.createElement(Ispaces.Constants.ElementNames.DIV);
            //var main=this.Create.createElement(Ispaces.Constants.ElementNames.DIV);
            var main=this.Create.createDiv();
            //main.wihi(this.windowWidth,this.apHeight);
            //main.miWi(222);
            
            return main;
        }

        , createMenu : function() {
            Ispaces.logger.debug('createMenu()');
            
            var _this=this; // Create a closure on this
            var cN='buttons';
            var buttonHeight=13;
            var ymdMargin='7px 0 0 2px';
            var calPrev='calprev';
            var calNext='calnext';
            var widthSelector=108;

            var Create = this.Create
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
            //var buttonYearPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.setYear(_this.year-1);_this.divYear.replaceFirst(createText(_this.year))});
            var buttonYearPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.prevYear()});
            var divYearPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divYearPrev.alM();
            divYearPrev.add(buttonYearPrev);
            */
            var buttonPaddingMWD='6px 13px 6px 13px';

            //var buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},null,null,'0',buttonPaddingMWD);
            //var buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},null,null,'0','6px 13px 6px 13px');
            //var buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},25,18,'0','0');
            //var buttonYearPrev=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},15,22,'0',null);
            //var buttonYearPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevYear()},15,21,'0','7px 4px 0px 4px');
            //var buttonYearPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevYear()},22,22,'0','4px 2px 2px 2px');
            var buttonYearPrev = createButton(createText('Previous Year'));
            buttonYearPrev.onclick = function(){_this.prevYear()};
            //buttonYearPrev.setWidthHeightPixels(22);
            //buttonYearPrev.setPadding('4px 2px 2px 2px');

            //var imgPrev=cImg(DIR_ICON+'window/left-next.gif',15);
            //var imgPrev=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue.gif',15);
            //var imgPrev=cImg(DIR_IMAGES+'arrow/next-white-trans-7x12.gif',15);
            //var imgPrev=cImg(DIR_IMAGES+'arrow/dev/Right_Blue_Arrow_clip_art_s.gif',15);
            //buttonYearPrev.add(imgPrev);
            //buttonYearPrev.alCM();
            //buttonYearPrev.add(createText('Today'));
            //var divYearPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divYearPrev=createCell();
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
            //var buttonYearNext=Ispaces.ui.createDivButton(calNext,function(){_this.setYear(_this.year+1);_this.divYear.replaceFirst(createText(_this.year))});
            var buttonYearNext=Ispaces.ui.createDivButton(calNext,function(){_this.nextYear()});
            var divYearNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divYearNext.add(buttonYearNext);
            divYearNext.alM();
            */

            //var buttonYearNext = Ispaces.ui.createAButton('topmenu-right',function(){_this.nextYear()},22,22,'0','4px 2px 2px 2px');
            //var buttonYearNext = createButton(); //'topmenu-right',function(){_this.nextYear()},22,22,'0','4px 2px 2px 2px');
            var buttonYearNext = createButton(createText('Next Year')); //'topmenu-right',function(){_this.nextYear()},22,22,'0','4px 2px 2px 2px');
            buttonYearNext.onclick = function(){_this.nextYear()};
            //var buttonYearNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextYear()},24,null,'0','4px');
            //var imgNext=cImg(DIR_IMAGES+'arrow/next-6B6D6B.gif',15);
            //var imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
            //var imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue-right.gif',20);
            //var imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-button-blue-right-30x.gif',20);
            //var imgNext=cImg(DIR_IMAGES+'arrow/dev/Untitled-5.gif',30);
            //var imgNext=cImg(DIR_IMAGES+'arrow/dev/right-on.gif',20);
            //buttonYearNext.add(imgNext);
            //var divYearNext = Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divYearNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divYearNext.wip(1);
            divYearNext.add(buttonYearNext);

            var yearDivRow=createRow([divYearPrev,this.divYear,divYearNext]);
            var yearDiv=createCell(yearDivRow);

            // month
            /*
            //var buttonMonthPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.setMonth(_this.month-1);_this.divMonth.replaceFirst(createText(_this.getMnth(_this.month)))});
            var buttonMonthPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.prevMonth()});
            var divMonthPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divMonthPrev.alM();
            divMonthPrev.add(buttonMonthPrev);
            */
            //var buttonMonthPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevMonth()},15,21,'0','7px 4px 0px 4px');
            //var buttonMonthPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevMonth()},22,22,'0','4px 2px 2px 2px');
            //var buttonMonthPrev = createButton();//'topmenu-left',function(){_this.prevMonth()},22,22,'0','4px 2px 2px 2px');
            var buttonMonthPrev = createButton(createText('Previous Month'));//'topmenu-left',function(){_this.prevMonth()},22,22,'0','4px 2px 2px 2px');
            buttonMonthPrev.onclick = function(){_this.prevMonth()};
            //var imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
            //buttonMonthPrev.add(imgPrev);
            //var divMonthPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divMonthPrev = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divMonthPrev.wip(1);
            divMonthPrev.add(buttonMonthPrev);

            ///*
            //this.divMonth=this.create.tag(Ispaces.Constants.ElementNames.DIV);
            this.divMonth=createDiv();
            //this.divMonth.wi(widthSelector);
            //this.divMonth.fW(Ispaces.Constants.Properties.BOLD);
            this.divMonth.add(createText(this.getMnth()));
            //*/
            var cellMonth=createCell(createRow([this.divMonth]));
            //cellMonth.wi(widthSelector);
            //cellMonth.fW(Ispaces.Constants.Properties.BOLD);
            //cellMonth.pa('0 8px 0 8px ');
            //cellMonth.alLM();

            cellMonth.setClass('blankoff');

            /*
            var buttonMonthNext=Ispaces.ui.createDivButton(calNext,function(){_this.setMonth(_this.month+1);_this.divMonth.replaceFirst(createText(_this.getMnth(_this.month)))});
            var buttonMonthNext=Ispaces.ui.createDivButton(calNext,function(){_this.nextMonth()});
            var divMonthNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divMonthNext.alM();
            divMonthNext.add(buttonMonthNext);
            */
            //var buttonMonthNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextMonth()},15,21,'0','7px 4px 0px 4px');
            //var buttonMonthNext=Ispaces.ui.createAButton('topmenu-right',function(){_this.nextMonth()},24,22,'0','4px 4px 2px 4px');
            //var buttonMonthNext=Ispaces.ui.createAButton('topmenu-right',function(){_this.nextMonth()},22,22,'0','4px 2px 2px 2px');
            //var buttonMonthNext = createButton(); //'topmenu-right',function(){_this.nextMonth()},22,22,'0','4px 2px 2px 2px');
            var buttonMonthNext = createButton(createText('Next Month')); //'topmenu-right',function(){_this.nextMonth()},22,22,'0','4px 2px 2px 2px');
            buttonMonthNext.onclick = function(){_this.nextMonth()};
            //var imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
            //var imgNext=cImg(DIR_IMAGES+'arrow/dev/arrow-black-rounded-on-blue.gif',20);
            //buttonMonthNext.add(imgNext);
            //var divMonthNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divMonthNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divMonthNext.wip(1);
            divMonthNext.add(buttonMonthNext);


            //var monthDivRow=createRow([divMonthPrev,this.divMonth,divMonthNext]);
            var monthDivRow=createRow([divMonthPrev,cellMonth,divMonthNext]);
            this.monthSelector=createCell(monthDivRow);

            // week
            /*
            var buttonWeekPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.prevWeek()});
            var divWeekPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divWeekPrev.alM();
            divWeekPrev.add(buttonWeekPrev);
            */
            //var buttonWeekPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevWeek()},15,21,'0','7px 4px 0px 4px');
            //var buttonWeekPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevWeek()},22,22,'0','4px 2px 2px 2px');
            //var buttonWeekPrev = createButton();//'topmenu-left',function(){_this.prevWeek()},22,22,'0','4px 2px 2px 2px');
            var buttonWeekPrev = createButton(createText('Previous Week'));//'topmenu-left',function(){_this.prevWeek()},22,22,'0','4px 2px 2px 2px');
            buttonWeekPrev.onclick = function(){_this.prevWeek()};
            //var imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
            //buttonWeekPrev.add(imgPrev);
            //var divWeekPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divWeekPrev = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divWeekPrev.wip(1);
            divWeekPrev.add(buttonWeekPrev);

            //this.divWeek=this.create.tag(Ispaces.Constants.ElementNames.DIV);
            this.divWeek = createDiv();
            //this.divWeek.wi(widthSelector);
            //this.divWeek.fW(Ispaces.Constants.Properties.BOLD);
            this.divWeek.add(createText(this.getWeek()));
            var cellWeek = createCell(createRow([this.divWeek]));
            //cellWeek.wi(widthSelector);
            //cellWeek.fW(Ispaces.Constants.Properties.BOLD);
            //cellWeek.pa('0 8px 0 8px ');
            //cellWeek.alLM();
            //cellWeek.setClass('blankoff');

            //var buttonWeekNext=Ispaces.ui.createAButton('topmenu-right',function(){_this.nextWeek()},22,22,'0','4px 2px 2px 2px');
            //var buttonWeekNext=Ispaces.ui.createAButton('topmenu-right',function(){_this.nextWeek()},22,22,'0','4px 2px 2px 2px');
            //var buttonWeekNext = createButton(); //'topmenu-right',function(){_this.nextWeek()},22,22,'0','4px 2px 2px 2px');
            var buttonWeekNext = createButton(createText('Next Week')); //'topmenu-right',function(){_this.nextWeek()},22,22,'0','4px 2px 2px 2px');
            buttonWeekNext.onclick = function(){_this.nextWeek()};
            //var imgNext=cImg(DIR_IMAGES+'arrow/right-next.gif',15);
            //buttonWeekNext.add(imgNext);
            //var divWeekNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divWeekNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divWeekNext.wip(1);
            divWeekNext.add(buttonWeekNext);

            var weekDivRow=createRow([divWeekPrev,cellWeek,divWeekNext]);
            this.weekSelector=createCell(weekDivRow);
            this.weekSelector.hide();

            // day
            /*
            var buttonDayPrev=Ispaces.ui.createDivButton(calPrev,function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))});
            var divDayPrev=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divDayPrev.alM();
            divDayPrev.add(buttonDayPrev);
            */
            //var buttonDayPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},15,21,'0','7px 4px 0px 4px');
            //var buttonDayPrev=Ispaces.ui.createAButton('topmenu-left',function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            //var buttonDayPrev = createButton();//'topmenu-left',function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            var buttonDayPrev = createButton(createText('Previous Day'));//'topmenu-left',function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            buttonDayPrev.onclick = function(){_this.prevDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))};
            //var imgPrev=cImg(DIR_IMAGES+'arrow/left-next.gif',15);
            //buttonDayPrev.add(imgPrev);
            //var divDayPrev=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divDayPrev = createCell(); //'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
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
            var buttonDayNext=Ispaces.ui.createDivButton(calNext,function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))});
            var divDayNext=Ispaces.ui.createDivCell(cN,null,buttonHeight,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divDayNext.alM();
            divDayNext.add(buttonDayNext);
            */
            //var buttonDayNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},15,21,'0','7px 4px 0px 4px');
            //var buttonDayNext=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            //var buttonDayNext = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            var buttonDayNext = createButton(createText('Next Day'));//Constants.Strings.POSITIVE+'-notop-on',function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))},22,22,'0','4px 2px 2px 2px');
            buttonDayNext.onclick = function(){_this.nextDay();_this.divDay.replaceFirst(createText(_this.getDayTh(_this.getDayOfWeek(),_this.dayOfMonth)))};
            //var imgNext=Ispaces.ui.createImage(Ispaces.Constants.Paths.IMAGES+'arrow/right-next.gif',15);
            //buttonDayNext.add(imgNext);
            //var divDayNext=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divDayNext = createCell();//'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divDayNext.wip(1);
            //divDayNext.alB();
            divDayNext.add(buttonDayNext);

            var dayDivRow=createRow([divDayPrev,this.divDay,divDayNext]);
            this.daySelector=createCell(dayDivRow);

            /*
            //var buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-eee',function(){_this.today()},null,null,Constants.Characters.ZERO,'1px 13px 1px 13px');
            var buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-hover',function(){_this.today()},null,null,Constants.Characters.ZERO,'1px 13px 1px 13px');
            buttonToday.add(createText(TODAY));
            var divToday=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            divToday.add(buttonToday);
            divToday.alB();
            divToday.paL(PX8);
            divToday.paB(Ispaces.Constants.Strings.PX3);
            */

            var buttonPaddingMWD='6px 13px 6px 13px';

            //var buttonToday=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},null,null,'0',buttonPaddingMWD);
            //var buttonToday = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},null,null,'0',buttonPaddingMWD);
            var buttonToday = createButton(createText('Today'));//Constants.Strings.POSITIVE+'-notop-on',function(){_this.start()},null,null,'0',buttonPaddingMWD);
            //buttonToday.add(imgOn);
            //buttonToday.add(createText('Today'));
            //var divToday=Ispaces.ui.createDivCell('buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divToday = createCell(); // 'buttons',null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divToday.wip(1);
            //divToday.alT();
            divToday.add(buttonToday);


            //var menuRow=createRow([dayDiv,this.weekSelector,this.monthSelector,yearDiv,divToday]);
            var menuRow=createRow([this.daySelector,this.weekSelector,this.monthSelector,yearDiv,divToday]);
            var menuRowCell=createCell(menuRow);

            //menuRowCell.wip(1);
            //menuRowCell.nowrap();

            var blankDiv=createCell();
            //blankDiv.wihi(1);
            var blankRow=createRow([blankDiv]);
            var blankTable=createCell(blankRow);
            blankTable.setClass('blank');
            //blankTable.alT();

            //var buttonMonth=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){_this.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
            //this.buttonMonth=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
            //this.buttonMonth = createButton();//Constants.Strings.POSITIVE+'-notop-on',function(){_this.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
            this.buttonMonth = createButton(createText('Month'));//Constants.Strings.POSITIVE+'-notop-on',function(){_this.showMonth()},null,null,Constants.Characters.ZERO,buttonPaddingMWD);
            this.buttonMonth.onclick = function(){_this.showMonth()};
            //buttonMonth.add(createText(MONTH));
            //this.buttonMonth.add(createText(this.Constants.MONTH));
            //var divMonth=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divMonth = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divMonth.wip(1);
            divMonth.add(this.buttonMonth);

            //var buttonWeek=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){_this.showWeek()},null,null,'0',buttonPaddingMWD);
            //this.buttonWeek=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.showWeek()},null,null,'0',buttonPaddingMWD);
            this.buttonWeek = createButton(createText(this.Constants.WEEK));//Constants.Strings.POSITIVE+'-notop-on',function(){_this.showWeek()},null,null,'0',buttonPaddingMWD);
            this.buttonWeek.onclick = function(){_this.showWeek()};
            //buttonWeek.add(createText(WEEK));
            //this.buttonWeek.add(createText(this.Constants.WEEK));
            //var divWeek=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divWeek = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divWeek.wip(1);
            divWeek.add(this.buttonWeek);

            //var buttonDay=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop',function(){_this.showDay()},null,null,'0',buttonPaddingMWD);
            //this.buttonDay=Ispaces.ui.createAButton(Ispaces.Constants.Strings.POSITIVE+'-notop-on',function(){_this.showDay()},null,null,'0',buttonPaddingMWD);
            this.buttonDay = createButton(createText(this.Constants.DAY));//Constants.Strings.POSITIVE+'-notop-on',function(){_this.showDay()},null,null,'0',buttonPaddingMWD);
            this.buttonDay.onclick = function(){_this.showDay()};
            //buttonDay.add(createText(DAY));
            //this.buttonDay.add(createText(this.Constants.DAY));
            //var divDay=Ispaces.ui.createDivCell(cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            var divDay = createCell();//cN,null,null,Constants.Characters.ZERO,Constants.Characters.ZERO);
            //divDay.wip(1);
            divDay.add(this.buttonDay);

            var dayWeekMonthRow=createRow([divMonth,divWeek,divDay]);
            var dayWeekMonth=createCell(dayWeekMonthRow);
            //dayWeekMonth.wip(1);
            //dayWeekMonth.alR();
            //dayWeekMonth.alT();

            //var menuDivTable=this.Create.createDivTable([menuRowCell,dayWeekMonth]);
            var menuDivTable = createDivTable([menuRowCell,blankTable,dayWeekMonth]);
            //menuDivTable.wip(100);
            //menuDivTable.boB('#A0A0A0 1px solid');

            //var menu=this.create.tagClass(Ispaces.Constants.ElementNames.DIV,'menu');
            var menu = createDiv().setClass('menu');
            //menu.ow(Ispaces.Constants.Properties.HIDDEN);
            menu.add(menuDivTable);

            //_this=null; // Dereference the closure so that it can be garbage collected.

            return menu;

        } // createMenu : function() {
              
        , createDivHeader: function() {
            console.log('createDivHeader()');

            var Create = this.Create
            , createElement = Create.createElement
            , createDiv = Create.createDiv
            , createSpan = Create.createSpan
            , createCell = Create.createCell
            , createDivTable = Create.createDivTable
            , createButton = Create.createButton
            , createText = Create.createText
            , createTextI18n = Create.createTextI18n
            ;

            //var divAuthenticate = this.createDivAuthenticate();
            //var cellAuthenticate = createCell(divAuthenticate);
            var divAuthenticate;
            var cellAuthenticate;
            var divUsername;

            if(this.config.instagramAccessToken) {

                //divUsername = createDiv(createText(this.config.instagramUsername)).setClass('label label-success').setFontSize('100%');
                divUsername = createButton(createText(this.config.instagramUsername)).setClass('btn btn-success btn-sm').setFontSize('100%');
                divUsername.addListener(this.Events.CLICK, this.clickButtonUsername.bind(this, divUsername));

                //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
                //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
                //divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success').setFontSize('100%');
                //var spanAuthenticate = createSpan(createText(this.config.instagramUsername)).setClass('label label-success');
                //var h3Authenticate = createElement('h3').add(spanAuthenticate);
                //cellAuthenticate.add(h3Authenticate);
                //return h3Authenticate;

                var divLogout = createButton(createText('Logout')).setClass('btn btn-md btn-success');
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
            var instagramError = this.config.instagramError;
            if(instagramError) {
                var errorMessage = instagramError.error_message;
                console.log('errorMessage = '+errorMessage);
                alert('errorMessage = '+errorMessage);

                //var divLabelError = createDiv(createText(errorMessage)).setClass('label label-danger lb-lg');
                var spanLabelError = createSpan(createText(errorMessage)).setClass('label label-danger label-large');
                var h3Error = createElement('h3').add(spanLabelError);
                cellAuthenticate.add(h3Error);
            }

            //var divHeader = createDivTable(createText(this.appName)).setClass('window-title');
            var h3Header = createElement('h3').add(createText(this.appName)).setClass('panel-title');
            var cellHeading = createCell(h3Header);
            var divTableHeading = createDivTable(cellHeading);
            if(divUsername != null) {
                divTableHeading.add(createCell(divUsername));
                divUsername.setMarginLeft(20);
                //divUsername.setPaddingLeft(20);
            }

            //var divHeader = createDivTable(createText(this.appName)).setClass('window-title panel-heading');
            //var divHeader = createDiv(h3Header).setClass('window-title panel panel-primary');
            //var divHeader = createDiv(h3Header).setClass('panel panel-primary');
            //var divHeader = createDiv(h3Header).setClass('panel-heading');
            var divHeader = createDivTable([
                //cellHeading
                createCell(divTableHeading)
              , cellAuthenticate
            ]).setClass('panel-heading');

            divHeader.setWidthPercent(100);

            return divHeader;

            var cellHeader = createCell(divHeader);
            //var cellHeader = createCell(divHeader).setClass('panel panel-primary');

            /*
            //var divButtonAuthenticate = createDiv(createText('Authenticate')).setClass('instagram-button large-button');
            var divButtonAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-default');
            var cellButtonAuthenticate = createCell(divButtonAuthenticate);
            */
            var cellAuthenticate = this.createCellAuthenticate();

            var divTable = createDivTable([
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
        }

        /*
        , createDivAuthenticate: function() {
            console.log('createDivAuthenticate()');

            var Create = this.Create
            , createElement = Create.createElement
            , createDiv = Create.createDiv
            , createSpan = Create.createSpan
            , createCell = Create.createCell
            , createDivTable = Create.createDivTable
            , createButton = Create.createButton
            , createText = Create.createText
            , createTextI18n = Create.createTextI18n
            ;

            var divAuthenticate;

            if(this.config.instagramAccessToken) {

                divAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success label-large').setHeightPixels(33);
                //var spanAuthenticate = createSpan(createText(this.config.instagramUsername)).setClass('label label-success');
                //var h3Authenticate = createElement('h3').add(spanAuthenticate);
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

            var Create = this.Create
            , createDiv = Create.createDiv
            , createCell = Create.createCell
            , createDivTable = Create.createDivTable
            , createButton = Create.createButton
            , createText = Create.createText
            , createTextI18n = Create.createTextI18n
            ;

            var cellAuthenticate;

            //if(this.instagramAccessToken) {
            if(this.config.instagramAccessToken) {
                var divLabelAuthenticate = createDiv(createText(this.config.instagramUsername)).setClass('label label-success');
                cellAuthenticate = createCell(divLabelAuthenticate);
            } else {
                var divButtonAuthenticate = createButton(createText('Authenticate')).setClass('btn btn-default');
                cellAuthenticate = createCell(divButtonAuthenticate);
                divButtonAuthenticate.addListener(this.Events.CLICK, this.mouseDownButtonAuthenticate.bind(this, divButtonAuthenticate));
            }

            return cellAuthenticate;
        }
        */

        , clickButtonLogout: function(button, e) {
            Ispaces.logger.debug(this.id+'.clickButtonLogout(button:'+button+', e:'+e+')');
            console.log(this.id+'.clickButtonLogout(button:'+button+', e:'+e+')');

            var logoutUrl = new Ispaces.StringBuilder()
              .append(this.contextUrl)
              .append("/logout")
              .toString();

            console.log('logoutUrl = '+logoutUrl);

            window.location.href = logoutUrl;
        }

        , mouseDownButtonAuthenticate: function(button, e) {
            Ispaces.logger.debug(this.id+'.mouseDownButtonAuthenticate(button:'+button+', e:'+e+')');
            console.log(this.id+'.mouseDownButtonAuthenticate(button:'+button+', e:'+e+')');

            var redirectUri = new Ispaces.StringBuilder()
              .append(this.contextUrl)
              .append("/instagram-redirect")
              .toString();

            var url = new Ispaces.StringBuilder()
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

        , populateData : function() {
    Ispaces.logger.debug(this.classId+'.populateData()');
    this.checkLocalStorage(this.entriesName);
    //this.showEntries();
    //this.removeEntries();
        }

        , populateYearMonthDay : function(date) {
            Ispaces.logger.debug(this.classId+'.populateYearMonthDay('+date+')');
            Ispaces.logger.alert(this.classId+'.populateYearMonthDay('+date+')');

            this.year=(date||this.now).getFullYear();
            this.month=(date||this.now).getMonth();
            this.weekday=(date||this.now).getDay();
            this.date=(date||this.now).getDate();

            /*
            */
            Ispaces.logger.debug('this.year = '+this.year);
            Ispaces.logger.debug('this.month = '+this.month);
            Ispaces.logger.debug('this.weekday = '+this.weekday);
            Ispaces.logger.debug('this.date = '+this.date);

            this.dateSelected=this.date;
            this.monthSelected=this.month;

        }

        , checkRemoteStorage:function(id){
            Ispaces.logger.debug(this.classId+'.checkRemoteStorage('+id+')');
        }

        , checkLocalStorage:function(id){
            Ispaces.logger.debug(this.classId+'.checkLocalStorage('+id+')');
    /*
    var _this=this;
    //this.store.get(id,function(ok, val) {
    this.store.get(id,function(ok,val){
      if(ok&&val){
        Ispaces.logger.alert(_this.classId+'.checkLocalStorage('+id+'): val = ' + val);
        this.entries=val;
        Ispaces.logger.alert(_this.classId+'.checkLocalStorage('+id+'): this.entries = ' + this.entries);
      }
    },this);
    */
    //this.store.get(id,this.setEntries,this);
        }

        , setDayWeekMonth : function(ok,val) {
            Ispaces.logger.alert(this.classId+'.setDayWeekMonth('+ok+','+val+')');
            if(ok&&val){
                Ispaces.logger.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): val = ' + val);
                Ispaces.logger.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): typeof val = ' + typeof val);
      //Ispaces.logger.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): Common.parens(val) = ' + Common.parens(val));
      //this.dayWeekMonth=eval(Common.parens(val));
                eval(Ispaces.Common.parens(val));
      /*
      if(val=='month'){
        Ispaces.logger.alert(this.classId+'.setDayWeekMonth('+ok+','+val+'): this.showMonth()');
        this.showMonth();
      }else if(val=='week'){
        Ispaces.logger.alert(this.classId+'.setDayWeekMonth('+ok+','+val+'): this.showWeek()');
        this.showWeek();
      }
      */
            }else{
                Ispaces.logger.debug(this.classId+'.setDayWeekMonth('+ok+','+val+'): No '+this.classId+' dayWeekMonth entry found.');
                this.showMonth();
            }
        }

        , setEntries : function(ok,val) {
    Ispaces.logger.alert(this.classId+'.setEntries('+ok+','+val+')');
    if(ok&&val){
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): val = ' + val);
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): typeof val = ' + typeof val);
      //this.entries=val;
      this.entries=eval(Ispaces.Common.parens(val));
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): this.entries = ' + this.entries);
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): typeof this.entries = ' + typeof this.entries);
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): this.entries.length = ' + this.entries.length);
    }else{
      Ispaces.logger.debug(this.classId+'.setEntries('+ok+','+val+'): No '+this.classId+' entries found.');
    }
        }

        , nextYear : function() {
            Ispaces.logger.alert(this.classId+'.nextYear()');

            this.setYear(this.year+1);
            this.refreshMonth();
        }

        , prevYear : function() {
            Ispaces.logger.alert(this.classId+'.prevYear()');

            this.setYear(this.year-1);
            this.refreshMonth();
        }

        , setYear:function(year){
            Ispaces.logger.alert(this.classId+'.setYear('+year+')');
            this.year=year;
            this.divYear.replaceFirst(this.Create.createText(this.year));
        }

        , prevMonth:function(){
            Ispaces.logger.alert(this.classId+'.prevMonth()');
            this.setMonth(this.month-1);
            this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
        }

        , nextMonth : function() {
            Ispaces.logger.alert(this.classId+'.nextMonth()');

    this.setMonth(this.month+1);
    this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
        }

        , setMonth : function(month) {
            Ispaces.logger.alert(this.classId+'.setMonth('+month+')');

            if(month<0){
                month=11;
                this.year--;
                this.divYear.replaceFirst(this.Create.createText(this.year));
            }else if(month>11){
                month=0;
                this.year++;
                this.divYear.replaceFirst(this.Create.createText(this.year));
            }
            this.month=month;

            this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)));
            this.refreshMonth();
        }

        , getMnth : function(month) { return this.MONTHS[(month?month:this.month)]}

        , getMnthPrev:function(month){
    if(month==0){
      return 11;
    }
    return month;
        }

        , setDayOfMonth : function(dayOfMonth) {
    this.dayOfMonth=dayOfMonth;
        }

        , prevWeek : function() {
            Ispaces.logger.alert(this.classId+'.prevWeek()');

    var daysInMonth=this.getDaysInMonth();
    Ispaces.logger.debug(this.classId+'.prevWeek(): daysInMonth = '+daysInMonth);

    if(!this.weekStartDate){
      this.weekStartDate=this.getWeekStartDate();
    }

    this.weekStartDate-=this.daysInWeek;
    Ispaces.logger.debug(this.classId+'.prevWeek(): this.weekStartDate = '+this.weekStartDate);

    if(this.weekStartDate<=0){
      this.setMonth(this.month-1);
      daysInMonth=this.getDaysInMonth();
      this.weekStartDate=(this.weekStartDate+daysInMonth); // add the zero count
      Ispaces.logger.debug(this.classId+'.prevWeek(): this.weekStartDate = '+this.weekStartDate);
      this.divMonth.replaceFirst(this.Create.createText(this.getMnth()))
    }
    this.divWeek.replaceFirst(this.Create.createText(this.getWeek(this.month,this.weekStartDate)));
        }

        , nextWeek:function(){
            Ispaces.logger.alert(this.classId+'.nextWeek()');

    //Ispaces.logger.debug(this.classId+'.nextWeek(): this.dayOfMonth = '+this.dayOfMonth);
    //Ispaces.logger.debug(this.classId+'.nextWeek(): this.date = '+this.date);

    var daysInMonth=this.getDaysInMonth();
    Ispaces.logger.debug(this.classId+'.nextWeek(): daysInMonth = '+daysInMonth);

    if(!this.weekStartDate){
      this.weekStartDate=this.getWeekStartDate();
    }

    /*
    this.date+=this.daysInWeek;
    Ispaces.logger.debug(this.classId+'.nextWeek(): this.date = '+this.date);
    */
    this.weekStartDate+=this.daysInWeek;
    Ispaces.logger.debug(this.classId+'.nextWeek(): this.weekStartDate = '+this.weekStartDate);

    //if(this.date>daysInMonth){
    if(this.weekStartDate>daysInMonth){

      /*
      this.date=this.date-daysInMonth;
      Ispaces.logger.debug(this.classId+'.nextWeek(): this.date = '+this.date);
      */
      this.weekStartDate=this.weekStartDate-daysInMonth;
      Ispaces.logger.debug(this.classId+'.nextWeek(): this.weekStartDate = '+this.weekStartDate);

      this.setMonth(this.month+1);
      //this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
      this.divMonth.replaceFirst(this.Create.createText(this.getMnth()))
    }
    //this.divWeek.replaceFirst(this.Create.createText(this.getWeek(null,this.weekStartDate)));
    this.divWeek.replaceFirst(this.Create.createText(this.getWeek(this.month,this.weekStartDate)));

    this.refreshWeek(this.weekStartDate);

        }

        , getWeekStartDate : function() {
            Ispaces.logger.debug(this.classId+'.getWeekStartDate()');
    Ispaces.logger.debug(this.classId+'.getWeekStartDate(): this.date = '+this.date);
    Ispaces.logger.debug(this.classId+'.getWeekStartDate(): this.weekday = '+this.weekday);
    var weekStartDate=this.date-this.weekday;
    if(weekStartDate<=0){
      //this.setMonth(this.month-1);
      //var daysInMonthPrev=this.getDaysInMonth();
      var daysInMonthPrev=this.getDaysInMonth(this.month-1);
      weekStartDate=daysInMonthPrev+weekStartDate;
    }
    return weekStartDate;
        }

        , getWeek : function(month, weekStartDate) {
            Ispaces.logger.debug(this.classId+'.getWeek()');
    var sb=new Ispaces.StringBuilder();
    //var month=this.MONTHS[(month?month:this.month)];
    var monthAbbr=this.MONTHS_ABBR[(month?month:this.month)];
    var daysInMonth=this.getDaysInMonth();
    sb.append(monthAbbr);
    sb.append(Ispaces.Constants.Characters.SPACE);

    if(!weekStartDate){
      Ispaces.logger.debug(this.classId+'.getWeek(): this.weekday = '+this.weekday);
      weekStartDate=this.getWeekStartDate();
    }
    /*
    var weekStartDate=this.date-this.weekday;
    if(weekStartDate<=0){
      this.setMonth(this.month-1);
      var daysInMonthPrev=this.getDaysInMonth();
      weekStartDate=daysInMonthPrev+weekStartDate;
    }
    */

    Ispaces.logger.debug(this.classId+'.getWeek(): weekStartDate = '+weekStartDate);
    sb.append(weekStartDate);
    sb.append(' - ');
    //sb.append(Ispaces.Constants.Characters.SPACE);sb.append(hyphen);sb.append(Ispaces.Constants.Characters.SPACE);
    //sb.append(Ispaces.Constants.Characters.SPACE);sb.append(urlhyphen);sb.append(Ispaces.Constants.Characters.SPACE);

    var weekEndDate=weekStartDate+(this.daysInWeek-1);
    if(weekEndDate>daysInMonth){
      weekEndDate=weekEndDate-daysInMonth;
      var monthNextAbbr=this.MONTHS_ABBR[(month?month+1:this.month+1)];
      Ispaces.logger.debug(this.classId+'.getWeek(): monthNextAbbr = '+monthNextAbbr);
      sb.append(monthNextAbbr);
      sb.append(Ispaces.Constants.Characters.SPACE);
    }
    Ispaces.logger.debug(this.classId+'.getWeek(): weekEndDate = '+weekEndDate);

    sb.append(weekEndDate);
    Ispaces.logger.debug(this.classId+'.getWeek(): sb.asString() = '+sb.asString());
    return sb.asString();

        }

        , nextDay : function() {
    Ispaces.logger.alert(this.classId+'.nextDay()');
    this.dayOfMonth++;
    var daysInMonth=this.getDaysInMonth();
    if(this.dayOfMonth>daysInMonth){
      this.dayOfMonth=1;
      this.setMonth(this.month+1);
      this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
    }
    Ispaces.logger.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
    var dayOfWeek=this.getDayOfWeek(daysInMonth);
    Ispaces.logger.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
        }

        , prevDay : function() {
            Ispaces.logger.alert(this.classId+'.prevDay()');
    this.dayOfMonth--;
    if(this.dayOfMonth==0){
      this.setMonth(this.month-1);
      var daysInMonth=this.getDaysInMonth();
      this.dayOfMonth=daysInMonth;
      this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
    }
    Ispaces.logger.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
    var dayOfWeek=this.getDayOfWeek(daysInMonth);
    Ispaces.logger.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
        }

        , getDayOfWeek : function(daysInMonth) {

            Ispaces.logger.debug(this.classId+'.getDayOfWeek()');

            if(!daysInMonth)daysInMonth=this.getDaysInMonth();
            var dayOfMonthCount=0;
            var cols=this.daysInWeek;
            var daysCount=0;
            var rows=1;
            var daysInRowOne=this.daysInWeek-this.monthWeekday;
            Ispaces.logger.debug(this.classId+'.getDayOfWeek(): daysInRowOne = '+daysInRowOne);
            daysCount+=daysInRowOne;
            Ispaces.logger.debug(this.classId+'.getDayOfWeek(): daysCount = '+daysCount);
            while(daysCount<daysInMonth){
              daysCount+=this.daysInWeek;
              Ispaces.logger.debug(this.classId+'.getDayOfWeek(): daysCount = '+daysCount);
              rows++;
              Ispaces.logger.debug(this.classId+'.v(): rows = '+rows);
            }
            Ispaces.logger.debug(this.classId+'.getDayOfWeek(): rows = '+rows);

            for(var i=0;i<rows;i++){
              for(var j=0;j<cols;j++){
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

        , today : function() {
            Ispaces.logger.alert(this.classId+'.today()');

            this.populateYearMonthDay(new Date());
            //this.setDay(this.day);
            this.setMonth(this.month);
            this.setYear(this.year);
            //this.store.get('calls',this.setDayWeekMonth,this); // get the button to select
        }

        , setDay : function(day) {
            Ispaces.logger.alert(this.classId+'.setDay('+day+')');

            this.dayOfMonth=day;
            var month=0;
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
    Ispaces.logger.debug(this.classId+'.nextDay()');
    this.dayOfMonth++;
    var daysInMonth=this.getDaysInMonth();
    if(this.dayOfMonth>daysInMonth){
      this.dayOfMonth=1;
      this.setMonth(this.month+1);
      this.divMonth.replaceFirst(this.Create.createText(this.getMnth(this.month)))
    }
    Ispaces.logger.debug(this.classId+'.nextDay(): this.dayOfMonth = '+this.dayOfMonth);
    var dayOfWeek=this.getDayOfWeek(daysInMonth);
    Ispaces.logger.debug(this.classId+'.nextDay(): dayOfWeek = '+dayOfWeek);
  },
*/

        , getNextHour : function(hour) {

            if(hour==12) {
                hour=0;
            }

            hour++;
            return hour;
        }

        , showMonth : function() {
            Ispaces.logger.alert(this.classId+'.showMonth()');

            if(!this.monthTable){
                this.createMonthCalendar();
            }

            //this.store.set('calls',"this.showMonth()");
            //this.store.set('calls','month');

            this.weekSelector.hide();
            this.daySelector.hide();
            this.monthSelector.show();
            if(this.weekDiv)this.weekDiv.hide();
            this.monthDiv.show();
            this.buttonMonth.setClass('positive-notop');
            this.buttonWeek.setClass('positive-notop-on');
            this.buttonDay.setClass('positive-notop-on');

            this.refreshMonth();
        }

        , showWeek : function() {
            Ispaces.logger.alert(this.classId+'.showWeek()');
    //this.store.set('calls',"this.showWeek()");
    //this.store.set('calls','week');

/*
    if(!this.showingDay){ // if we click the week button a second time, show the day
      this.showDay();
      return;
    }
*/

    if(!this.weekHeaderTable){
      this.createWeekCalendar();
    }

    if(this.monthDiv)this.monthDiv.hide();
    this.monthSelector.hide();
    this.daySelector.hide();
    this.weekSelector.show();
    this.buttonMonth.setClass('positive-notop-on');
    this.buttonDay.setClass('positive-notop-on');
    this.buttonWeek.setClass('positive-notop');

    if(this.showingDay){
      var cols=this.weekHeaderTds.length;
      for(var i=0;i<cols;i++){
        this.weekHeaderTds[i].show();
      }
      var weekTdCols=this.weekTds.length;
      Ispaces.logger.debug(this.classId+'.showWeek(): weekTdCols = '+weekTdCols);
      for(var i=0;i<weekTdCols;i++){
        this.weekTds[i].show();
      }
      this.showingDay=false;
    }

    this.weekDiv.show();

        }

        , showDay : function() {
            Ispaces.logger.alert(this.classId+'.showDay()');

    if(this.monthDiv)this.monthDiv.hide();

    Ispaces.logger.debug(this.classId+'.showDay(): this.showingDay = '+this.showingDay);

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
    var cols=this.daysInWeek;
    for(var i=0;i<cols;i++){
      if(i!=4){
        $('weekHeader'+i).hide();
      }
    }
*/
    var cols=this.weekHeaderTds.length;
    for(var i=0;i<cols;i++){
      this.weekHeaderTds[i].hide();
    }

/*
    var weekTrCols=this.weekTrs.length;
    for(var i=0;i<weekTrCols;i++){
      alert('this.weekTrs['+i+'].hide()');
      this.weekTrs[i].hide();
    }
*/

/*
    var weekCols=this.weekColgroups.length;
    alert('weekCols = '+weekCols);
    for(var i=0;i<weekCols;i++){
      alert('this.weekColgroups.['+i+'].hide()');
      this.weekColgroups[i].hide();
    }
*/

///*
    var weekTdCols=this.weekTds.length;
    Ispaces.logger.debug(this.classId+'.showDay(): weekTdCols = '+weekTdCols);
    for(var i=0;i<weekTdCols;i++){
      this.weekTds[i].hide();
    }
//*/
    this.showingDay=true;
        }

        , createMonthCalendar:function(){
            Ispaces.logger.debug(this.classId+'.createMonthCalendar()');
            //Ispaces.logger.alert(this.classId+'.createMonthCalendar()');
            //alert(this.classId+'.createMonthCalendar()');

            var ElementNames = Ispaces.Constants.ElementNames;

            var monthDiv = this.Create.createDiv().setClass('month-div');
            monthDiv.setHeightPercent(100);

            var monthTable = this.monthTable = Ispaces.Create.createHtmlTable(null,1);
            //this.monthTable.ba('#ccc');
            //this.monthTable.wiphip(100);
            this.monthTable.setClass('month');

            var tHead = this.Create.createElement(ElementNames.THEAD);

            var tableHeight = 7;
            var tr = this.Create.createElement(ElementNames.TR);

            for(var i = 0; i < this.daysInWeek; i++) {

                var th = this.Create.createElement(ElementNames.TH);
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

            Ispaces.logger.debug(this.classId+'.createWeekCalendar()');

        this.now = new Date();
        this.populateYearMonthDay();

        this.weekDiv = this.Create.createElement(Ispaces.Constants.ElementNames.DIV);

        this.weekHeaderTable=Ispaces.Create.createHtmlTable(null,1);
        this.weekHeaderTable.setClass('weekHeader');

        //var mainWH=Common.getWH(this.divMain);
        //var totalWidth=mainWH[0]-16-40;
        //this.headerWidth=Math.floor((totalWidth/this.daysInWeek));
        //this.headerWidthMiWi=this.headerWidth-33;

        //Ispaces.logger.debug(this.classId+'.createWeekCalendar(): mainWH[0] = '+mainWH[0]);
        //Ispaces.logger.debug(this.classId+'.createWeekCalendar(): totalWidth = '+totalWidth);
        //Ispaces.logger.debug(this.classId+'.createWeekCalendar(): this.headerWidth = '+this.headerWidth);

        //this.refreshWeekHeader();

        var divScroll=this.Create.createDiv();
        var scrollbarWidth=getScrollbarWidth();
        Ispaces.logger.debug(this.classId+'.createWeekCalendar(): scrollbarWidth = '+scrollbarWidth);
        //divScroll.wi((scrollbarWidth-1));
        //divScroll.hi(this.heightDayHeader);
        //divScroll.bo(CCC1);
        //divScroll.boW('1px 1px 1px 0');

        var weekHeaderTableDiv=this.Create.createCell(this.weekHeaderTable);
        //weekHeaderTableDiv.alT();
        var weekHeaderTableDivScroll=this.Create.createCell(divScroll);

        //weekHeaderTableDivScroll.wip(1);
        var weekHeaderTableDivRow = this.Create.createRow([weekHeaderTableDiv,weekHeaderTableDivScroll]);
        var weekHeaderTableDivTable=this.Create.createDivTable(weekHeaderTableDivRow);
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

            Ispaces.logger.debug(this.classId+'.refreshWeekHeader('+weekStartDate+')');

    if(!weekStartDate){
      weekStartDate=this.getWeekStartDate();
    }
    Ispaces.logger.debug(this.classId+'.refreshWeekHeader(): weekStartDate = '+weekStartDate);

    var month=this.month+1;
    var daysInMonth=this.getDaysInMonth();
    Ispaces.logger.debug(this.classId+'.refreshWeekHeader(): daysInMonth = '+daysInMonth);

    var weekEndDate=weekStartDate+(this.daysInWeek-1);
    if(weekEndDate>daysInMonth){
      weekEndDate=weekEndDate-daysInMonth;
    }
    Ispaces.logger.debug(this.classId+'.refreshWeekHeader(): weekEndDate = '+weekEndDate);

    var weekDate=weekStartDate;
    var tHead=this.Create.createElement(Ispaces.Constants.ElementNames.THEAD);
    var cols=this.daysInWeek;
    var tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);
    this.weekHeaderTds=[];
    for(var i=-1;i<cols;i++){
      var th=this.Create.createElement(Ispaces.Constants.ElementNames.TH);
      //td.id='weekHeader'+i;
      tr.add(th);

      if(i==-1){ // The time column

        var divTime=this.Create.createDiv();
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

        var divDay=this.Create.createDiv();
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

    var curHead=_(this.weekHeaderTable,Constants.ElementNames.THEAD);

    if(curHead&&curHead.length>0){
      Ispaces.logger.debug(this.classId+'.refresh(): curHead = '+curHead);
      Ispaces.logger.debug(this.classId+'.refresh(): curHead.length = '+curHead.length);
      //this.weekHeaderTable.replace(tHead,curHead[0]);
      this.weekHeaderTable.replaceFirst(tHead);
    }else{
      this.weekHeaderTable.add(tHead);
    }

        }

        , refreshWeek : function(weekStartDate) {
            Ispaces.logger.debug(this.classId+'.refreshWeek('+weekStartDate+')');

            if(!this.weekHeaderTable) this.createWeekCalendar();

            if(!weekStartDate) weekStartDate=this.getWeekStartDate();
    
            var weekDate=weekStartDate;
            Ispaces.logger.debug('weekDate = '+weekDate);

            this.refreshWeekHeader(weekStartDate);

            this.monthSelector.hide();
            this.weekSelector.show();
            if(this.monthDiv)this.monthDiv.hide();
            this.weekDiv.show();

            Ispaces.logger.debug('this.apHeight = '+this.apHeight);
            var mainWH=Ispaces.Common.getWidthHeight(this.divMain);
            Ispaces.logger.debug('mainWH[1] = '+mainWH[1]);

            var tBody = this.Create.createElement('tbody');

            var hourOfDay=11;
            var hour=hourOfDay;
            var cols=this.daysInWeek;
            var rows=24;
            var amPm='am';
            var isPm=false;
            var workDay=false;
            var newHour=false;
            var tdHeight=40;
            this.weekColgroups=[];
            this.weekTds=[];

            for(var i=0; i < rows; i++) {

                var tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);

                if(i==12){
                    amPm='pm';
                    isPm=true;
                }

                Ispaces.logger.debug('hour = '+hour);

                hourOfDay = this.getNextHour(hourOfDay);

                var hourArray = [hourOfDay,amPm];
                hour = hourArray.join(Ispaces.Constants.Characters.EMPTY);
                tr.hourOfDay=hourOfDay;

                for(var j = -1; j < cols; j++) {

                    var td=this.Create.createElement((j==-1) ? Ispaces.Constants.ElementNames.TH : Ispaces.Constants.ElementNames.TD);

                    tr.add(td);
                    td.setHeightPixels(tdHeight);
                    var weekend=(j==0||j==(cols-1));
                    var today=((j+weekStartDate)==this.date);


                    if(j>-1&&!today) {
                        this.weekTds.push(td);
                    }

                    if(i==0) {

                        var colgroup=this.Create.createElement('colgroup');

                        if(j>-1&&!today){
                            colgroup.bo('#ffcc00 3px solid');
                        }

                        this.weekColgroups[j]=colgroup;
                        this.weekTable.add(colgroup);
                    }

                    if(j==-1) { // The time column

                        td.setHeightPercent(100);
                        td.setWidthPixels(33);

                        var divTime=this.Create.createDiv();
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

                        var div0=this.Create.createDiv();
                        var div1=this.Create.createDiv();
                        if(weekend){
                            div0.boB('#ddd 1px dotted');
                        }else{
                            div0.boB('#ddd 1px dotted');
                        }

                        div0.setHeightPixels(tdHeight/2);
                        div0.add(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                        div1.setHeightPixels(tdHeight/2);
                        div1.add(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                        var div2=this.Create.createDiv();
                        div2.setMinWidthPixels(this.headerWidthMiWi);
                        div2.add(div0);
                        div2.add(div1);


                        td.add(div2);

                        td.dayOfWeek=this.DAYS[j];

                    }

                } // for(var j = -1; j < cols; j++) {

                tBody.add(tr);

            } // for(var i=0; i < rows; i++) {

            //var curBody=_(this.weekTable,Constants.ElementNames.TBODY);
            var curBody = this.weekTable.getElementsByTagName(Ispaces.Constants.ElementNames.TBODY);

            if(curBody&&curBody.length>0){
                Ispaces.logger.debug(this.classId+'.refresh(): curBody = '+curBody);
                Ispaces.logger.debug(this.classId+'.refresh(): curBody.length = '+curBody.length);
                this.weekTable.replaceFirst(tBody);
                //this.weekTable.replace(this.tBodyWeek,curBody[0]);
            }else{
                this.weekTable.add(tBody);
                //this.weekTable.add(this.tBodyWeek);
            }

        } // refreshWeek : function(weekStartDate) {

        , refreshMonth : function() {
            Ispaces.logger.alert(this.classId+'.refreshMonth()');

            var _this=this;
            var Create = this.Create;

            var monthDate=new Date(this.year, this.month, 1);
            this.monthWeekday=monthDate.getDay();

            Ispaces.logger.debug('monthDate = '+monthDate);
            Ispaces.logger.debug('this.monthWeekday = '+this.monthWeekday);
            Ispaces.logger.debug('this.entries.length = '+this.entries.length);

            this.weekStartDay=0;
            var offset=0;
            offset=(this.monthWeekday>=this.weekStartDay)?this.monthWeekday-this.weekStartDay:7-this.weekStartDay+this.monthWeekday;
            Ispaces.logger.debug('offset = '+offset);

            var daysInMonth=this.getDaysInMonth();
            var daysInMonthPrev=this.DAYS_IN_MONTH[this.getMnthPrev(this.month)];

            Ispaces.logger.debug('daysInMonth = '+daysInMonth);
            Ispaces.logger.debug('daysInMonthPrev = '+daysInMonthPrev);

            var tBody = this.Create.createElement(Ispaces.Constants.ElementNames.TBODY);

            var dayOfMonth=0;

            // cols & rows (dynamic)
            var cols=this.daysInWeek;
            var daysCount=0;
            var rows=1;
            var daysInRowOne=this.daysInWeek-this.monthWeekday;
            Ispaces.logger.debug('daysInRowOne = '+daysInRowOne);
            daysCount+=daysInRowOne;
            Ispaces.logger.debug('daysCount = '+daysCount);
            while(daysCount<daysInMonth){
                daysCount+=this.daysInWeek;
                Ispaces.logger.debug('daysCount = '+daysCount);
                rows++;
                Ispaces.logger.debug('rows = '+rows);
            }
            Ispaces.logger.debug('rows = '+rows);

            for(var i=0; i<rows; i++) {

                var tr = Create.createElement(Ispaces.Constants.ElementNames.TR);
                tBody.add(tr);

                for(var j=0; j<cols; j++) {

                    var td = Create.createElement(Ispaces.Constants.ElementNames.TD);
                    tr.add(td);

                    var weekend=(j==0||j==(cols-1));

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

                        //var calItems=getCalItemsByDayMonthYear
                        var calItems=this.getCalItemsByDay(dayOfMonth);

                        if(calItems && calItems.length>0){ // We have calendar entries

                            Ispaces.logger.debug('calItems ='+calItems.length);
                            var calItemsDiv=this.createCalItemsDiv(calItems,td.dayOfMonth);
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
                                //_this.divDay.innerHTML=_this.getDayTh(this.dayOfWeek,this.dayOfMonth);
                                this.setClass('weekend-on');
                              }
                            );

                            if(weekend) {

                              //td.mf(function(){this.baco(_this.colorWeekend,OOO)})
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
                        for(var i=0;i<this.entries.length;i++){
                        //Ispaces.logger.alert('this.entries['+i+'] = '+this.entries[i]);
                        //Ispaces.logger.alert('this.entries['+i+'].where = '+this.entries[i].where);
                        //var calItem=this.entries[i];
                        }
                        Ispaces.logger.debug('calItem = '+calItem);
                        Ispaces.logger.debug('calItem[\'where\'] = '+calItem['where']);
                        */
                        var today=(dayOfMonth==this.date&&this.monthSelected==this.month);
                        Ispaces.logger.debug('dayOfMonth:'+dayOfMonth+', today = '+today);

                        if(today) {
                            Ispaces.logger.debug('dayOfMonth:'+dayOfMonth+', today = '+today);
                            td.setClass('today');
                            //td.ba('#ffcc00');
                        }

                        //td.dc(function(){alert('dbllick')}); // double click

                        //td.oc(function(){
                        td.addListener(

                            Ispaces.Constants.Events.CLICK

                            , function(){

                              Ispaces.logger.alert('td.oc()');

                              _td=this;

                              this.setBackground('red');
                              //this.mf(null);

                              var apWH = Ispaces.Common.getWidthHeight(_this.divApplication);
                              var mainWH = Ispaces.Common.getWidthHeight(_this.divMain);
                              var menuWH = Ispaces.Common.getWidthHeight(_this.menu);

                              Ispaces.logger.alert('td.oc(): apWH[1] = '+apWH[1]+', mainWH[1] = '+mainWH[1]+', menuWH[1] = '+menuWH[1]);

                              /*
                              var td=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              td.style.opacity='0.77';
                              td.ba('#333');
                              td.co(Ispaces.Constants.Colors.FFF);
                              td.wiphip(100,100);
                              var tr=this.Create.createElement(Ispaces.Constants.ElementNames.TR);
                              tr.add(td);
                              _this.greyout=Common.Create.table();
                              _this.greyout.wiphip(100,100);
                              _this.greyout.add(tr);
                              //td.hi(apWH[1]);
                              _this.greyout.rel(0,-(apWH[1]));
                              */
                              ///*
                              //_this.greyout=this.Create.createDiv();
                              //_this.greyout=this.create.tagClass(Ispaces.Constants.ElementNames.DIV,'greyout');
                              _this.greyout = Create.createDiv().setClass('greyout');

                              //_this.greyout.op(_this.opacityGreyout,_this.colorGreyout);

                              _this.greyout.positionRelative(0, -(mainWH[1]));
                              _this.greyout.setHeightPixels(mainWH[1]);
                              //*/

                              _this.divApplication.add(_this.greyout); // Add the greyout layer.
                              // Re-adjust the app height after adding the greyout layer.
                              //_this.divApplication.ow(Ispaces.Constants.Properties.HIDDEN);
                              //_this.divApplication.hi(apWH[1]);

                              _this.disableResizing();

                              var options={
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

                              //var modalWindow=new Window('addEvent','Add Event',options);
                              _this.setDayOfMonth(this.dayOfMonth);
                              //var modalWindow=new Window('addEvent','Add Event: '+_this.getDateTh(this.dayOfWeek,this.dayOfMonth),options);
                              var modalWindow = new ModalWindow('addEvent',_this.getDateTh(this.dayOfWeek,this.dayOfMonth),options);

                              //modalWindow.addHideable(_this.greyout);

                              // Inner class: Hideable.
                              var Hideable=function(ap,td){
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

                              var hidethis=new Hideable(_this,_td);
                              modalWindow.addHideable(hidethis);

                              var div = Create.createDiv();
                              div.setBackground(Ispaces.Constants.Colors.FFF);

                              //var formName='form-calendar-entry'_td;
                              var formName='form-calendar-entry'+_td.dayOfMonth;
                              //var form=this.create.tagId('form',formName);
                              var form = Create.createElement('form').setId(formName);
                              form.name=formName;

                              var year=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,YEAR,_this.year);
                              var month=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,MONTH,_this.month);
                              var day=Ispaces.ui.createInput(Ispaces.Constants.Properties.HIDDEN,DAY,this.dayOfMonth);
                              var what=Ispaces.ui.createFormElement('What','text','what',null);
                              var when=Ispaces.ui.createFormElement('When','text','when',null);
                              var where=Ispaces.ui.createFormElement('Where','text','where',null);
                              var notes=Ispaces.ui.createFormElement('Notes','text','notes',null);
                              //var save=Ispaces.ui.createFormElement(Ispaces.Constants.Characters.EMPTY,'button','save','Save');

                              /*
                              var inputWhat=cI('text','name','name');
                              var inputWhen=cI('text','when','name');
                              var inputWhere=cI('text','where','name');
                              var inputNotes=cI('text','notes',null);
                              */
                              var inputSave=Ispaces.ui.createInput('button','save','Save');

                              //inputSave.onclick=function(){alert('test')};
                              inputSave.oc(function(){

                                Ispaces.logger.debug('inputSave.oc()');
                                Ispaces.logger.debug('inputSave.oc(): modalWindow.id = '+ modalWindow.id);

                                /*
                                var fields=[YEAR,MONTH,DAY,'what','when','where','notes'];
                                //var calendarEntryObject=formToObject($('form-calendar-entry'),fields);
                                var calItemJson=formToObjectString(formName,fields);
                                Ispaces.logger.alert('calItemJson = '+calItemJson);
                                //var calItem=JSON.parse(line);
                                var calItem=eval(Common.parens(calItemJson));
                                _this.updateStore(_this.entriesName,calItem);
                                */

                                var url=Ajax.serialize(form);
                                Ispaces.logger.debug('url = '+url);
                                var baseUrl=contextUrl+Ispaces.Constants.Characters.FSLASH+this.objectId;
                                //Ispaces.logger.alert(this.classId+'.doLogin(): baseUrl = '+baseUrl);
                                var qs=new Ispaces.QueryString();
                                //qs.append(form.action);
                                qs.append(_this.objectId);
                                qs.append(QUESTION);
                                qs.append(url);
                                qs.add(TASKID,'save');
                                Ispaces.logger.alert('qs.asString() = '+qs.asString());
                                var ajax=new Ispaces.Ajax(qs.asString(),function(r){_this.processSave(r)});
                                ajax.doGet();


                            /*
                                //alert(calendarEntryObject.toJSONString());
                                //Ispaces.logger.debug('calendarEntryObject.toJson(): '+calendarEntryObject.toJson());
                                //alert('calendarEntryObject.toJson().asString(): '+calendarEntryObject.toJson().asString());
                                var json=JSON.stringify(calendarEntryObject);
                                //Ispaces.logger.debug('JSON.stringify(calendarEntryObject) = '+JSON.stringify(calendarEntryObject));
                                Ispaces.logger.debug('json = '+json);

                                //var jsonObj=JSON.parse(json);
                                var jsonObj=JSON.parse(json, function (key, value) {
                                    var d;
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

                                //var cI=eval(line);
                                //var cI=JSON.parse(line);
                                var cI=JSON.parse(line, function (key, value) {
                                    var d;
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
                                Ispaces.logger.printObject(cI);
                                for(var n in cI){
                                  Ispaces.logger.debug('n = '+n);
                                  //alert('calItem['+n+'] = '+calItem[n]);
                                  //var v = calItem[n];
                                  //alert(n+' = '+v);
                                }
                                if(cI){
                                  alert('cI');
                                  alert('typeof cI = '+typeof cI);
                                  alert('cI.what = '+cI.what);
                                  alert('cI[where] = '+cI['where']);
                                }

                                alert('_this.store.get(\'entryCountName\') = "'+_this.store.get(_this.entryCountName)+'"');
                                _this.entryCount=parseInt(_this.getEntryCount());
                                alert('_this.entryCount='+_this.entryCount);
                                _this.entryCount+=1;
                                _this.store.set(_this.entryCountName,(_this.entryCount));
                                _this.checkLocalStorage();
                                _this.getEntries();

                            */

                                _this.refreshMonth();
                                modalWindow.hide();
                              });

                              var tdSave=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              tdSave.add(inputSave);
                              //var save=Common.Create.tR([null,input])
                              //var save=Common.Create.tR([new Td(Ispaces.Constants.Characters.NBSP),input])
                              var tdNbsp=Ispaces.Create.createTableData(this.Create.createText(Ispaces.Constants.Characters.NBSP));
                              var save=Ispaces.Create.createTableRow([tdNbsp,tdSave]);
                              //var save=Common.Create.tR([tdSave])

                              var eventTable=Ispaces.Create.createHtmlTable(2,0);
                              eventTable.setClass('calendarevent');
                            /*
                              var tdWhat=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              tdWhat.add(inputWhat);
                              var tdWhen=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              tdWhen.add(inputWhen);
                              var tdWhere=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              tdWhere.add(inputWhere);
                              var tdNotes=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              tdNotes.add(inputNotes);
                              var tdSave=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
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

                              _this.centeringTable = Ispaces.Create.createHtmlTable(); // Table for centering
                              //_this.centeringTable.wip(100);
                              //_this.centeringTable.hi(mainWH[1]);
                              //_this.centeringTable.rel(0,-(mainWH[1]*2));
                              var td=this.Create.createElement(Ispaces.Constants.ElementNames.TD);
                              //td.alCM();
                              //td.wip(100);
                              //td.hi(mainWH[1]);
                              var tr = Ispaces.Create.createTableRow(td);
                              _this.centeringTable.add(tr);
                              tr.add(td);


                              /*
                              _this.ap.add(modalWindow.window);
                              modalWindow.window.maT('25px');
                              modalWindow.window.rel(0,-(mainWH[1]*2));
                              */

                              td.add(modalWindow.window);
                              _this.divApplication.add(_this.centeringTable);

                            }

                            ,false
                        );

                    }

                    //tr.add(td);

                }  // for(var j=0; j<cols; j++) {

                //tBody.add(tr);

            } // for(var i=0; i<rows; i++) {

            //var curBody=_(this.monthTable,Constants.ElementNames.TBODY);
            var curBody=this.monthTable.getElementsByTagName(Ispaces.Constants.ElementNames.TBODY);
            //var currentTBody = null;
            //if(this.monthTable) currentTBody = this.monthTable.currentTBody;

            Ispaces.logger.debug('curBody = '+curBody);

            if(curBody&&curBody.length>0){
            //if(currentTBody) {

                //Ispaces.logger.alert('curBody = '+curBody);
                //Ispaces.logger.debug('curBody.length = '+curBody.length);
                this.monthTable.replace(tBody, curBody[0]);
                //this.monthTable.replace(tBody, currentTBody);

                //var curBody2=_(this.monthTable,'tbody');
                //Ispaces.logger.debug('curBody2 = '+curBody2);
                //Ispaces.logger.debug('curBody2.length = '+curBody2.length);

            } else {
                //this.monthTable.currentTBody = tBody;
                this.monthTable.add(tBody);
            }

            //_this=null;

        } // refreshMonth : function() {

        , processSave : function(r) {
            Ispaces.logger.alert(this.classId+'.processSave('+r+')');
        }

        , disableResizing:function(){
            Ispaces.logger.alert(this.classId+'.disableResizing()');
    /*
    for(var i=0;i<this.handles.length;i++){
      this.handles[i].disable();
    }
    */
        }

        , enableResizing:function(){
            Ispaces.logger.alert(this.classId+'.enableResizing()');
    /*
    for(var i=0;i<this.handles.length;i++){
      this.handles[i].enable();
    }
    */
        }

        , addResizable:function(resizable){
            Ispaces.logger.debug(this.classId+'.addResizable()');
    /*
    for(var i=0;i<this.handles.length;i++){
      this.handles[i].addResizable(resizable);
    }
    */
        }

        , calculateHeight:function(){
            Ispaces.logger.alert(this.classId+'.calculateHeight()');

            if(!viewableWH)viewableWH=getViewableWH();
            if(this.topMenu)if(!this.topMenu.wh)this.topMenu.wh=Common.getWH(this.topMenu);

    /*
    Ispaces.logger.alert(this.id+'.calculateHeight(): viewableWH[0] = '+viewableWH[0]+', viewableWH[1] = '+viewableWH[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.topMenu.wh[0] = '+this.topMenu.wh[0]+', this.topMenu.wh[1] = '+this.topMenu.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.bottomMenu.wh[0] = '+this.bottomMenu.wh[0]+', this.bottomMenu.wh[1] = '+this.bottomMenu.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.wh[0] = '+this.resizableWindow.titlebar.wh[0]+', this.resizableWindow.titlebar.wh[1] = '+this.resizableWindow.titlebar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.wh[0] = '+taskbar.wh[0]+', taskbar.wh[1] = '+taskbar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.divTable.wh[0] = '+taskbar.divTable.wh[0]+', taskbar.divTable.wh[1] = '+taskbar.divTable.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.autoHiding = '+taskbar.autoHiding);
    */

    var h=viewableWH[1];
    if(this.topMenu)h-=this.topMenu.wh[1];
    h-=this.resizableWindow.titlebar.wh[1];
    h-=3; // Back the bottom off a little.
    //Ispaces.logger.alert(this.id+'.calculateHeight(): h='+h);

    //return {w:w,h:h};
    //return {w:windowWH[0],h:h};
    return {w:viewableWH[0],h:h};

        }

        , calculateAppDivHeight:function(){
    Ispaces.logger.alert(this.classId+'.calculateAppDivHeight()');
    if(!viewableWH)viewableWH=getViewableWH();
    /*
    Ispaces.logger.alert(this.id+'.calculateAppDivHeight(): viewableWH[0] = '+viewableWH[0]+', viewableWH[1] = '+viewableWH[1]);
    Ispaces.logger.alert(this.id+'.calculateAppDivHeight(): this.topMenu.wh[0] = '+this.topMenu.wh[0]+', this.topMenu.wh[1] = '+this.topMenu.wh[1]);
    */
    var h=viewableWH[1];
    h-=this.resizableWindow.titlebar.wh[1];
    //Ispaces.logger.alert(this.id+'.calculateAppDivHeight(): h='+h);
    return {w:viewableWH[0],h:h};
        }

        , calculateHalfHeight:function(){
    Ispaces.logger.alert(this.classId+'.calculateHalfHeight()');
    if(!viewableWH)viewableWH=getViewableWH();
    if(this.topMenu)if(!this.topMenu.wh)this.topMenu.wh=Common.getWH(this.topMenu);
    var h=viewableWH[1];
    var h=h/2;
    if(this.topMenu)h-=this.topMenu.wh[1];
    h-=this.resizableWindow.titlebar.wh[1];
    //Ispaces.logger.alert(this.id+'.calculateHalfHeight(): h='+h);
    return {w:viewableWH[0],h:h};
        }

        , calculateAppDivHalfHeight:function(){
    Ispaces.logger.alert(this.classId+'.calculateAppDivHalfHeight()');
    if(!viewableWH)viewableWH=getViewableWH();
    var h=viewableWH[1];
    var h=h/2;
    h-=this.resizableWindow.titlebar.wh[1];
    //Ispaces.logger.alert(this.id+'.calculateAppDivHalfHeight(): h='+h);
    return {w:viewableWH[0],h:h};
        }

        , calculateHalfWidth:function(){
    Ispaces.logger.alert(this.classId+'.calculateHalfWidth()');
    if(!viewableWH)viewableWH=getViewableWH();
    if(this.topMenu)if(!this.topMenu.wh)this.topMenu.wh=Common.getWH(this.topMenu);
    /*
    Ispaces.logger.alert(this.id+'.calculateHalfWidth(): windowWH[0] = '+windowWH[0]+', windowWH[1] = '+windowWH[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.bottomMenu.wh[0] = '+this.bottomMenu.wh[0]+', this.bottomMenu.wh[1] = '+this.bottomMenu.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.wh[0] = '+this.resizableWindow.titlebar.wh[0]+', this.resizableWindow.titlebar.wh[1] = '+this.resizableWindow.titlebar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.wh[0] = '+taskbar.wh[0]+', taskbar.wh[1] = '+taskbar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.divTable.wh[0] = '+taskbar.divTable.wh[0]+', taskbar.divTable.wh[1] = '+taskbar.divTable.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHalfWidth(): taskbar.autoHiding = '+taskbar.autoHiding);
    */
    var h=viewableWH[1];
    if(this.topMenu)h-=this.topMenu.wh[1];
    h-=this.resizableWindow.titlebar.wh[1];
    h-=3; // Back the bottom off a little.
    //Ispaces.logger.alert(this.id+'.calculateHeight(): h='+h);
    var wi=viewableWH[0];
    var wi=wi/2;
    //Ispaces.logger.alert(this.id+'.calculateHalfWidth(): wi = '+wi);
    return {w:wi,h:h};
        }

        , calculateAppDivHalfWidth:function(){
    Ispaces.logger.alert(this.classId+'.calculateAppDivHalfWidth()');
    if(!viewableWH)viewableWH=getViewableWH();
    /*
    Ispaces.logger.alert(this.id+'.calculateHalfWidth(): windowWH[0] = '+windowWH[0]+', windowWH[1] = '+windowWH[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.bottomMenu.wh[0] = '+this.bottomMenu.wh[0]+', this.bottomMenu.wh[1] = '+this.bottomMenu.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): this.resizableWindow.titlebar.wh[0] = '+this.resizableWindow.titlebar.wh[0]+', this.resizableWindow.titlebar.wh[1] = '+this.resizableWindow.titlebar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.wh[0] = '+taskbar.wh[0]+', taskbar.wh[1] = '+taskbar.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHeight(): taskbar.divTable.wh[0] = '+taskbar.divTable.wh[0]+', taskbar.divTable.wh[1] = '+taskbar.divTable.wh[1]);
    Ispaces.logger.alert(this.id+'.calculateHalfWidth(): taskbar.autoHiding = '+taskbar.autoHiding);
    */
    var h=viewableWH[1];
    h-=this.resizableWindow.titlebar.wh[1];
    h-=3; // Back the bottom off a little.
    //Ispaces.logger.alert(this.id+'.calculateHeight(): h='+h);
    var wi=viewableWH[0];
    var wi=wi/2;
    //Ispaces.logger.alert(this.id+'.calculateHalfWidth(): wi = '+wi);
    return {w:wi,h:h};
        }

        , maximize:function(){
    //Ispaces.logger.debug(this.classId+'.maximize()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);
    /*
    this.iframe.wh=Common.getWH(this.iframe); // Save the iframe width/height for restore.
    */
    /*
    Ispaces.logger.alert(this.id+'.maximize(): this.divApplication.wh[0] = '+this.divApplication.wh[0]+', this.divApplication.wh[1] = '+this.divApplication.wh[1]);
    Ispaces.logger.alert(this.id+'.maximize(): this.divMain.wh[0] = '+this.divMain.wh[0]+', this.divMain.wh[1] = '+this.divMain.wh[1]);
    Ispaces.logger.alert(this.id+'.maximize(): this.iframe.wh[0]='+this.iframe.wh[0]+', this.iframe.wh[1]='+this.iframe.wh[1]);
    */
    var wh=this.calculateHeight();
    //this.iframe.wihi(wh[0],wh[1]);
    this.divMain.wihi(wh[0],wh[1]);
    //this.divApplication.wihi(wh[0],wh[1]);

    var divApplicationHeight=this.calculateAppDivHeight();
    this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h);

    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
        }

        , restore:function(){
            //Ispaces.logger.debug(this.classId+'.restore()');
    //this.showHandles();
    //this.iframe.wihi(this.iframe.wh[0],this.iframe.wh[1]);
    this.divApplication.wihi(this.divApplication.wh[0],this.divApplication.wh[1]);
    //this.divApplication.wi(this.divApplication.wh[0]);
    this.divMain.wihi(this.divMain.wh[0],this.divMain.wh[1]);
    /*
    Ispaces.logger.alert(this.id+'.restore(): this.divApplication.wh[0] = '+this.divApplication.wh[0]+', this.divApplication.wh[1] = '+this.divApplication.wh[1]);
    Ispaces.logger.alert(this.id+'.restore(): this.divMain.wh[0] = '+this.divMain.wh[0]+', this.divMain.wh[1] = '+this.divMain.wh[1]);
    */
    this.draggableAp.addMouseDown(); // Re-add the ability to drag the window.
    this.padHandles=true;
        }

        , snapTop : function() {
            //Ispaces.logger.debug(this.classId+'.snapTop()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);
    /*
    Ispaces.logger.alert(this.id+'.snapTop(): this.divApplication.wh[0] = '+this.divApplication.wh[0]+', this.divApplication.wh[1] = '+this.divApplication.wh[1]);
    Ispaces.logger.alert(this.id+'.snapTop(): this.divMain.wh[0] = '+this.divMain.wh[0]+', this.divMain.wh[1] = '+this.divMain.wh[1]);
    */
    var wh=this.calculateHalfHeight();
    this.divMain.wihi(wh[0],wh[1]);

    var divApplicationHeight=this.calculateAppDivHalfHeight();
    this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h);

    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

        , snapBottom:function(){
    //Ispaces.logger.debug(this.classId+'.snapBottom()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);
    var wh=this.calculateHalfHeight();
    this.divMain.wihi(wh[0],wh[1]-3); // Back the bottom off a little because of the shadow.
    var divApplicationHeight=this.calculateAppDivHalfHeight();
    this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

        , snapLeft:function(){
    //Ispaces.logger.debug(this.classId+'.snapLeft()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);
    var wh=this.calculateHalfWidth();
    this.divMain.wihi(wh[0],wh[1]-3); // Back the bottom off a little because of the shadow.
    var divApplicationHeight=this.calculateAppDivHalfWidth();
    this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

        , snapRight:function(){
    //Ispaces.logger.debug(this.classId+'.snapRight()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);
    var wh=this.calculateHalfWidth();
    this.divMain.wihi(wh[0],wh[1]-3); // Back the bottom off a little because of the shadow.
    var divApplicationHeight=this.calculateAppDivHalfWidth();
    this.divApplication.wihi(divApplicationHeight.w,divApplicationHeight.h-3);
    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

        , snapTopLeft:function(){
    //Ispaces.logger.debug(this.classId+'.snapTopLeft()');
    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);

    var w=this.calculateHalfWidth();
    var h=this.calculateHalfHeight();
    this.divMain.wihi(w.w,h.h);

    var divApplicationWidth=this.calculateAppDivHalfWidth();
    var divApplicationHeight=this.calculateAppDivHalfHeight();
    this.divApplication.wihi(divApplicationWidth.w,divApplicationHeight.h);

    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

        , snapTopRight:function(){
    //Ispaces.logger.debug(this.classId+'.snapTopRight()');

    this.divApplication.wh=Common.getWH(this.divApplication);
    this.divMain.wh=Common.getWH(this.divMain);

    var w=this.calculateHalfWidth();
    var h=this.calculateHalfHeight();
    this.divMain.wihi(w.w,h.h);

    var divApplicationWidth=this.calculateAppDivHalfWidth();
    var divApplicationHeight=this.calculateAppDivHalfHeight();
    this.divApplication.wihi(divApplicationWidth.w,divApplicationHeight.h);

    this.draggableAp.removeMouseDown(); // Remove the ability to drag the window.
    this.padHandles=false;
        }

  /*
  ,hideHandles:function(){
    Ispaces.logger.debug(this.classId+'.hideHandles()');
    Ispaces.logger.debug(this.classId+'.hideHandles(): this.handles.length = '+this.handles.length);
    for(var i=0;i<this.handles.length;i++){
      this.handles[i].hide();
      //this.s.hi(0);
    }
  }

  ,showHandles:function(){
    Ispaces.logger.debug(this.classId+'.showHandles()');
    //Ispaces.logger.alert(this.classId+'.showHandles(): this.handles.length = '+this.handles.length);
    for(var i=0;i<this.handles.length;i++){
      this.handles[i].show();
    }
  }
  */

        , getDateTh:function(dayOfWeek,dayOfMonth){
    Ispaces.logger.debug(this.classId+'.getDateTh('+dayOfWeek+','+dayOfMonth+')');
    var sb = new Ispaces.StringBuilder();
    sb.append(dayOfWeek);
    sb.append(COMMASPACE);
    sb.append(this.getMnth());
    sb.append(Ispaces.Constants.Characters.SPACE);
    sb.append(this.getTh(dayOfMonth));
    sb.append(Ispaces.Constants.Characters.SPACE);
    sb.append(this.year);
    Ispaces.logger.debug(this.classId+'.getDateTh('+dayOfWeek+','+dayOfMonth+') = '+sb.asString());
    return sb.asString();
        }

        , getDayTh:function(dayOfWeek,dayOfMonth){
    Ispaces.logger.debug(this.classId+'.getDayTh('+dayOfWeek+','+dayOfMonth+')');
    var sb = new Ispaces.StringBuilder();
    sb.append(dayOfWeek);
    sb.append(Ispaces.Constants.Characters.SPACE);
    sb.append(this.getTh(dayOfMonth));
    Ispaces.logger.debug(this.classId+'.getDayTh('+dayOfWeek+','+dayOfMonth+') = '+sb.asString());
    return sb.asString();
        }

        , getTh:function(dayOfMonth){
    Ispaces.logger.debug(this.classId+'.getTh('+dayOfMonth+')');
    var sb = new Ispaces.StringBuilder();
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
    Ispaces.logger.debug(this.classId+'.getTh('+dayOfMonth+') = '+sb.asString());
    return sb.asString();
        }

///*
        , getDaysInMonth:function(){
            Ispaces.logger.debug(this.classId+'.getDaysInMonth()');
    var daysInMonth=this.DAYS_IN_MONTH[this.month];
    if(this.month==1&&((this.year%4 == 0)&&(this.year%100!= 0))||(this.year%400==0)){
      daysInMonth=29;
    }
    return daysInMonth;
        }
//*/
/* Using a switch statement to get days of month
  getDaysInMonth:function(){
    Ispaces.logger.debug(this.classId+'.getDaysInMonth()');
    var days=0;
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
            Ispaces.logger.debug(this.classId+'.getEntryCount()');
    /*
    var entryCount=this.store.get(this.entryCountName);
    Ispaces.logger.debug(this.classId+'.getEntryCount(): entryCount = "'+entryCount+'"');
    //if(entryCount&&(!entryCount==NaN)){
    if(entryCount){
      return parseInt(entryCount);
    }else{
      return 0;
    }
    */
  }

        , getEntries:function(){
            Ispaces.logger.debug(this.classId+'.getEntries()');
    Ispaces.logger.debug(this.classId+'.getEntries(): this.entryCount = '+this.entryCount);
    for(var i=0;i<this.entryCount;i++){
      Ispaces.logger.debug(this.classId+'.getEntries(): entry'+i);
      /*
      this.store.get('entry'+i,function(ok,val){
        if(ok){
          Ispaces.logger.error(this.classId+'.getEntries(): entry'+i+', val = ' + val);
          if(!isNull(val)){
            Ispaces.logger.debug(this.classId+'.getEntries(): isNull(val) = ' + (isNull(val)));
            //var entry=JSON.parse(val);
            var entry=eval(Common.parens(val));
            //Ispaces.logger.error(this.classId+'.getEntries(): entry'+i+', entry = '+entry);
            //Ispaces.logger.error(this.classId+'.getEntries(): entry'+i+', typeof entry = '+typeof entry);
            //Ispaces.logger.printObject(entry);
            //for(var n in entry){
              //Ispaces.logger.debug('n = '+n);
              //alert('entry['+n+'] = '+entry[n]);
              //var v = entry[n];
              //alert(n+' = '+v);
            //}
            //for(var object
            //Ispaces.logger.error(this.classId+'.getEntries(): entry'+i+', entry.what = '+entry.what);
            //Ispaces.logger.error(this.classId+'.getEntries(): entry'+i+', entry.when = '+entry.when);
            Ispaces.logger.debug(this.classId+'.getEntries(): entry'+i+', entry[where] = '+entry['where']);
          }
        }
      });
      */
    }
        }

        , createCalItemsDiv:function(calItems,day){
            Ispaces.logger.debug(this.classId+'.createCalItemsDiv('+calItems+')');
    Ispaces.logger.debug(this.classId+'.createCalItemsDiv('+calItems+'): calItems.length = '+calItems.length);

    var bgColor='#fff888';
    //var bgColor='#FFD324';
    //var bgColor='#ffee88';
    var color='#333';

    var outerDiv=this.Create.createDiv();
    //outerDiv.bo('green 1px solid');
    outerDiv.alT();
    //outerDiv.wiphip(100);
    //outerDiv.ow(Ispaces.Constants.Properties.HIDDEN);
    var dayDiv=this.Create.createDiv();
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
    for(var i=0;i<calItems.length;i++){
      var innerDiv=this.Create.createDiv();
      innerDiv.bo(bgColor+' 1px solid');
      //innerDiv.ma('1px');
      var calItemDiv=this.createCalItemDiv(calItems[i]);
      calItemDiv.hide();
      var calItemSummary=this.getCalItemSummary(calItems[i]);
      innerDiv.add(this.Create.createText(calItemSummary));
      innerDiv.add(calItemDiv);
      //div.hide();
      outerDiv.add(innerDiv);
    }
    return outerDiv;
        }

        , getCalItemSummary:function(calItem){
    var sb=new Ispaces.StringBuilder();
    sb.append(calItem.what);
    sb.append(', ');
    sb.append(calItem.when);
    sb.append(' at ');
    sb.append(calItem.where);
    return sb.asString()
        }

        , createCalItemDiv:function(calItem){
    Ispaces.logger.debug(this.classId+'.createCalItemDiv('+calItem+')');
    Ispaces.logger.debug(this.classId+'.createCalItemDiv('+calItem+'): calItem.what = '+calItem.what);
    var div=this.Create.createDiv();
    var what=this.Create.createText(calItem.what);
    var when=this.Create.createText(calItem.when);
    var where=this.Create.createText(calItem.where);
    var notes=this.Create.createText(calItem.notes);
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
            Ispaces.logger.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+')');
    Ispaces.logger.debug(this.classId+'.getCalItemsByDay(): this.entries.length = '+this.entries.length);
    var calItems=[];
    for(var i=0;i<this.entries.length;i++){
      var calItem=this.entries[i];
      //Ispaces.logger.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+'): calItem[\'what\'] = '+calItem['what']);
      //Ispaces.logger.debug(this.classId+'.getCalItemsByDay('+dayOfMonth+'): calItem[\'day\'] = '+calItem['day']);
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
    Ispaces.logger.alert(this.classId+'.updateStore:('+id+',o)');
    Ispaces.logger.debug(this.classId+'.updateStore:('+id+',o): this.entries = '+this.entries.length);
    this.addEntry(o);
    Ispaces.logger.debug(this.classId+'.updateStore:('+id+',o): this.entries = '+this.entries.length);
    var json=JSON.stringify(this.entries);
    Ispaces.logger.alert(this.classId+'.updateStore:('+id+',o): json = '+json);
    Ispaces.logger.debug(this.classId+'.updateStore:('+id+',o): this.store.set(id,json)');
    //this.store.set(id,json);
  }

        , showEntries:function(){
            Ispaces.logger.debug(this.classId+'.showEntries()');
    //var entries=this.store.get('entries');
    var _this=this;
    var entries=null;
    /*
    this.store.get(this.entriesName,function(ok,val){
      if(ok){
        //Ispaces.logger.debug(this.classId+'.showEntries(): val = '+val);
        Ispaces.logger.debug('.showEntries(): val = '+val);
        if(val){
          entries=val;
          Ispaces.logger.debug('.showEntries(): entries = '+entries);
          _this.entries=JSON.parse(entries);
        }
      }
    });
    */
    Ispaces.logger.debug(this.classId+'.showEntries(): entries = '+entries);

    if(entries){
      //var jsonArray=JSON.parse(entries);
      var jsonArray=eval(Common.parens(entries));
      this.entries=jsonArray;
      if(jsonArray){
        Ispaces.logger.debug(this.classId+'.showEntries(): jsonArray = '+jsonArray);
        Ispaces.logger.debug(this.classId+'.showEntries(): typeof jsonArray = '+typeof jsonArray);
        Ispaces.logger.debug(this.classId+'.showEntries(): jsonArray.length = '+jsonArray.length);
      }
    }

            _this=null;

        }

        , removeEntries : function() {
            Ispaces.logger.debug(this.classId+'.removeEntries()');
    //this.store.remove(this.entriesName);
/*
    Ispaces.logger.debug(this.classId+'.removeEntries(): this.entryCount = '+this.entryCount);
    for(var i=0;i<this.entryCount;i++){
      Ispaces.logger.debug(this.classId+'.removeEntries(): entry'+i);
      this.store.remove('entry'+i,function(ok,val){
        if(ok){
          Ispaces.logger.error(this.classId+'.removeEntries(): REMOVED entry'+i+', val = ' + val);
        }
      });
    }
    this.entryCount=0;
    this.store.set(this.entryCountName,(this.entryCount));
*/
        }

        , drag : function(x,y,draggable){
            Ispaces.logger.debug(this.id+'.drag('+x+', '+y+', '+draggable+')');

    var windowDiv=this.windowDiv;

    var windowXY=windowDiv._xy
      ,windowWH=windowDiv._wh
    ;

    if(!windowXY)windowXY=windowDiv._xy=Common.getXY(windowDiv);
    if(!windowWH)windowWH=windowDiv._wh=Common.getWH(windowDiv);

    var windowX=windowXY[0]
      ,windowY=windowXY[1]
      ,windowW=windowWH[0]
      ,windowH=windowWH[1]
    ;

    if(
      (x>windowX)
      &&(x<(windowX+windowW))
      &&(y>windowY)
      &&(y<(windowY+windowH))
    ){

      if(!this.isOver){
        this.isOver=true;
        this.mouseEnter(draggable);
      }

      return true; // handled!

    }else if(this.isOver){
      this.isOver=false;
    }

            return false; // not handled!
        }

        , mouseEnter : function(draggable) {
            Ispaces.logger.debug(this.id+'.mouseEnter(draggable:'+draggable+')');

            draggable.rowBottom.hide();
            draggable.isOverDesktop=false;
        }

        , destroySave : function(e) {
            Ispaces.logger.debug(this.classId+'.destroySave('+e+')');

        this.resizableWindow.hid(); // First off hide the window.. Calls ResizableWindow.windowDiv.hid()

        if(e)Common.stopEvent(e);
        var id=this.id;
        //new Ispaces.AsyncApply(this,this.destroy,null,50);
        new Ispaces.AsyncCall(this,this.destroy,50);
        }

        , destroy : function() {
            Ispaces.logger.debug(this.classId+'.destroy()');

            this.resizableWindow.destroyWindow();
            Ispaces.spaces.space.removeAp(this);
            Ispaces.spaces.space.store.remove(this.id);

            for(var p in this){
                this[p]=null;
                delete this[p];
            }
        }

    }
);

Ispaces.Calendar['start'] = function(config) {
    Ispaces.logger.debug('Ispaces.Calendar.start('+config+')');
    console.log('Ispaces.Calendar.start('+config+')');
    window['ispacesCalendar'] = new Ispaces.Calendar(config);
};
