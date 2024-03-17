function crawData(){
    inProgress = 'Wrong Answer';
    window.timeout_copy_testcase = setInterval(() => {

        const allModelsMonaco = monaco.editor.getModels();

        if( content === null ){
            const values =  allModelsMonaco[0].getValue();
            content = values;
        }

        var codeArg = content.split('\n');

        codeArg.splice(numberInsertCode, 0, dataReturn);

        for( let i = 0 ; i < listData.length; i ++ ){
            codeArg.splice(numberInsertCode, 0, 'if( _index === '+i + ') return '+listData[i].expected+';');
        }
        codeArg.splice(numberInsertCode, 0, '_index++;');

        codeArg.splice(0, 0, 'var _index = -1;');
        codeArg.splice(0, 0, prepareCode);

        allModelsMonaco[0].setValue(codeArg.join('\n'));

        if( inProgress === 'Accepted' ){
            alert('done');
            clearInterval(window.timeout_copy_testcase);
            return;
        }

        if( inProgress === 'Wrong Answer' ){
            var buttonElement = document.querySelector('button[data-e2e-locator="console-submit-button"]');
            if( buttonElement ){
                buttonElement.click();
            }
        }

    }, 100 );


}


fetchOld = fetch;
// Define your interceptor functions
const requestInterceptor = async (url, options) => {
    // Modify the request or do something before sending it
    return [url, options];
};

const responseInterceptor = async (url, response) => {
    // Modify the response or do something after receiving it

    if( url === '/problems/two-sum/submit/' ){
        let response2 = response.clone();
        let data = await response2.json();
        idSubmmitCurrent = data.submission_id;
    }

    if( idSubmmitCurrent !== null && url === '/submissions/detail/'+idSubmmitCurrent+'/check/' ){
        let response2 = response.clone();
        let data = await response2.json();
        if( data.status_msg ){

            if( data.status_msg === 'Accepted' ){
                inProgress = 'Accepted';
            } else if( data.status_msg === 'Wrong Answer' ) {
                inProgress = 'Wrong Answer';
                listData.push({
                    input: data.input,
                    expected: data.expected_output,
                });
            }
        }
    }

    return response;
};

// Your fetch function with interceptors
const fetchWithInterceptors = async (url, options) => {
    // Apply request interceptor
    const [modifiedUrl, modifiedOptions] = await requestInterceptor(url, options);

    // Make the fetch request
    const response = await fetchOld(modifiedUrl, modifiedOptions);

    // Apply response interceptor
    const modifiedResponse = await responseInterceptor(url, response);

    return modifiedResponse;
};

fetch = fetchWithInterceptors;

const prepareCode = ``;
const dataReturn = 'return [-99,-99]'
const listData = [];
var content = null;
const numberInsertCode = 6;
let idSubmmitCurrent = null;
let inProgress = null;
crawData();


// var buttonElement = document.querySelectorAll('.rounded-b .align-middle');























function changeValue(editorMonaco, value){
    var codeArg = value.split('\n');

    codeArg.splice(14, 0, dataReturn);

    for( let i = 0 ; i < listData.length; i ++ ){
        codeArg.splice(14, 0, 'if( _index === '+i + ') return arrayToLinkedList('+listData[i].expected+');');
    }
    codeArg.splice(14, 0, '_index++;');

    codeArg.splice(0, 0, 'var _index = -1;');
    codeArg.splice(0, 0, prepareCode);

    editorMonaco.setValue(codeArg.join('\n'));

    window.timeout_copy_testcase = setInterval(() => {

        var buttonElement = document.querySelector('button[data-e2e-locator="console-submit-button"]');
        if( buttonElement ){
            buttonElement.click();

            var buttonElement = document.querySelector('button[data-e2e-locator="console-submit-button"]');

            if( buttonElement ){

                var buttonElement = document.querySelectorAll('.rounded-b .align-middle');

                if( buttonElement.length > 0 ){
                    var dataTestCase = crawTestCase(buttonElement);
                    if( checkTestCaseLastCraw(dataTestCase) ){
                        listData.push(dataTestCase);
                        clearInterval(window.timeout_copy_testcase);
                        crawData();
                    }
                }

            }
        }

    }, 100 );


}

function crawTestCase(buttonElement){

    var expected = buttonElement[buttonElement.length-1].textContent;

    var input = [];

    for( let i = 0 ; i < buttonElement.length - 2; i ++ ){
        input.push(buttonElement[i].textContent);
    }

    return {
        input: input,
        expected: expected,
    };

}

function checkTestCaseLastCraw(testCase){

    for( let i = 0; i < listData.length ; i ++ ){
        if ( JSON.stringify( testCase ) === JSON.stringify( listData[i] ) ){
            return false;
        }
    }

    return true;
}

function crawData(save_content = false){
     window.time_interval = setInterval(() => {

        var url = window.location.href;

        const leetCodeChallengePattern = /\/problems\//;

        if (leetCodeChallengePattern.test(url)) {

            if( window.monaco ){
                const allModels = monaco.editor.getModels();

                if( allModels.length === 2){
                    if( save_content ){
                        const values =  allModels[0].getValue();
                        content = values;
                    }
                    changeValue( allModels[0], content );
                    clearInterval(window.time_interval);
                }
            }

        }else{
            clearInterval(window.time_interval);
        }

    }, 100);
}

const prepareCode = `function arrayToLinkedList(arr) {
    if (arr.length === 0) {
        return null;
    }

    let head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}`;
const dataReturn = 'return new ListNode(-9999999999999);'
const listData = [];
var content = '';
crawData(true);



// var buttonElement = document.querySelectorAll('.rounded-b .align-middle');