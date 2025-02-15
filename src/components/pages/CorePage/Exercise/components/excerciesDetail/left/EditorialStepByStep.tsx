// import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Alert, AlertTitle, Box, Button, Skeleton } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Prism from 'prismjs';
import React from 'react';
import codingChallengeService, { IEditorialStepByStep } from 'services/codingChallengeService';
// const preCode = `
// 0###var twoSum = function (nums, target) {
// 1,0###    const map = new Map();
// 2###    for (let i = 0; i < nums.length; i++) {
// 3,2###        const complement = target - nums[i];
// 4###        if (map.has(complement)) {
// 5,4###            return [map.get(complement), i];
// 4###        }
// 6###        map.set(nums[i], i);
// 2###    }
// 7###    return null;
// 0###};
// `

// const intros = [
//   'Khai báo phương thức, nums là dãy các số nguyên không âm: VD: [2, 7, 11, 15], target là tổng 2 số bằng với số đa cho VD: 9',
//   'Tạo một HashMap để lưu các số đã duyệt qua',
//   'Duyệt qua từng số trong mảng',
//   'Tính phần còn lại cần thiết để đạt được target',
//   'Kiểm tra nếu phần còn lại đã tồn tại trong HashMap',
//   'Nếu có, trả về chỉ số của phần còn lại và chỉ số hiện tại',
//   'Nếu không, lưu số hiện tại vào HashMap với chỉ số của nó',
//   'Nếu không tìm thấy, trả về một null',
// ];

// function parseStringToObject(str: string) {
//   const parts = str.split('###'); // Sử dụng biểu thức chính quy để tách
//   if (parts.length === 2) {

//     const postion = parts[0].split(',');

//     return {
//       position: parseInt(postion[0], 10), // Chuyển đổi phần đầu thành số nguyên
//       prePostion: parseInt(postion[1] ?? -1, 10),
//       text: parts[1] // Phần sau là text giữ nguyên thụt đầu dòng
//     };
//   }

//   return {
//     position: 0, // Chuyển đổi phần đầu thành số nguyên
//     prePostion: -1,
//     text: '' // Phần sau là text giữ nguyên thụt đầu dòng
//   };
// }

// const afterCode = preCode.trim().split("\n").map(parseStringToObject);
// const maxPostion = 7;

function EditorialStepByStep({ id, steps }: { id: ID, steps?: Array<IEditorialStepByStep> }) {

  const [editorialStepByStep, setEditorialStepByStep] = React.useState<Array<IEditorialStepByStep> | null | false>(null);
  const [, setUseful] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [maxStep, setMaxStep] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [code] = React.useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    (async () => {
      const temps = steps ? { steps } : await codingChallengeService.getEditorialStepByStep(id);

      let maxStep = 0;

      temps?.steps?.forEach(item => {
        if (parseInt(item.position + '', 10) > maxStep) {
          maxStep = parseInt(item.position + '', 10);
        }
      });
      setMaxStep(maxStep);
      setEditorialStepByStep(temps?.steps ?? false);
      setUseful(temps?.useful ?? 0);
    })();
  }, [id]);

  // const handlePostEditorialStepByStepUseful = async () => {
  //   const result = await codingChallengeService.postEditorialStepByStepUseful(id);
  //   if (result) {
  //     setUseful(1);
  //   }
  // }

  React.useEffect(() => {

    if (editorialStepByStep) {
      let codeTemp2: string[] = [];
      const lineChange: number[] = [];
      const comments = [];
      for (let index = 0; index < editorialStepByStep.length; index++) {
        const element = editorialStepByStep[index];

        const prePostion = parseInt(element.prePostion + '', 10)

        if (element.position <= step) {
          codeTemp2.push(element.code.replaceAll('__', ' '));

          if (parseInt(element.position + '', 10) === step) {
            lineChange.push(codeTemp2.length - 1);
            if (element.comment) {
              comments.push('<strong>Hàng ' + codeTemp2.length + ': </strong> ' + element.comment);
            }
          }
        }

        if (prePostion !== -1 && prePostion === (step)) {
          codeTemp2.push(" ");
          lineChange.push(codeTemp2.length - 1);
        }

      }
      // setCode(codeTemp2.join('\n'));
      setComment(comments.join('\n'));
      let codeEls: HTMLElement | null;
      if (ref.current && (codeEls = ref.current.querySelector('code'))) {

        const highlightedCode = Prism.highlight(codeTemp2.join('\n'), Prism.languages.javascript, 'javascript').split('\n');

        if (step > 0) {
          for (let index = 0; index < lineChange.length; index++) {
            const line = lineChange[index];
            highlightedCode[line] = '<span class="code-changed" style="font-family: monospace;background-color: rgba(141, 141, 141, 0.3);display: inline-block;width: 100%;">' + highlightedCode[line] + '</span>';
          }
        }

        codeEls.innerHTML = highlightedCode.join('\n') + '<span aria-hidden="true" class="line-numbers-rows">' + [...Array(highlightedCode.length)].map(() => '<span></span>').join('') + '</span>';
      }
      // setTimeout(() => {
      //   const highlightedCode = Prism.highlight(codeTemp2.join('\n'), Prism.languages.javascript, 'javascript');

      //   let codeAfterHightlight = highlightedCode.split('\n');

      //   codeAfterHightlight = codeAfterHightlight.map(str => str.replace('######', '</span>').replace('#####', '<span class="code-changed" style="font-family: monospace;">'))

      //   let codeEls: HTMLElement | null;
      //   if (ref.current && (codeEls = ref.current.querySelector('code'))) {
      //     codeEls.innerHTML = codeAfterHightlight.join('\n') + '<span aria-hidden="true" class="line-numbers-rows">' + [...Array(codeAfterHightlight.length)].map(() => '<span></span>').join('') + '</span>';
      //   }
      // }, 0);
    }
  }, [step, editorialStepByStep]);

  if (editorialStepByStep === false) {
    return <React.Fragment />;
  }

  if (editorialStepByStep === null) {
    return <Skeleton
      variant='rectangular'
      sx={{
        width: '100%',
        height: 180,
      }}
    />
  }

  return (<Box>
    <CodeBlock
      ref={ref}
      html={'<pre id="code" class="line-numbers language-javascript"><code>' + code + '</code></pre>'}
      sx={{
        lineHeight: '30px',
      }}
    />
    <Alert
      color='info'
      icon={false}
      sx={{
        mb: 1,
        mt: 1,
      }}
    >
      <AlertTitle><strong>Bước {step + 1}:</strong></AlertTitle>
      <Box
        dangerouslySetInnerHTML={{ __html: comment.replaceAll('\n', '<br />') }}
        sx={{
          fontSize: '16px',
          lineHeight: '30px',
        }}
      />
    </Alert>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button variant='contained' disabled={step < 1} onClick={() => setStep(prev => prev > 0 ? --prev : 0)} color='inherit' sx={{ color: 'text.primary' }}>Quay lại</Button>
      <Button variant='contained' disabled={step >= maxStep} onClick={() => setStep(prev => prev < maxStep ? ++prev : maxStep)}>Tiếp tục</Button>
      {/* {
        step >= maxStep ?
          useful ?
            <Button variant='text' startIcon={<CheckRoundedIcon />} color='success'>Hữu ích</Button>
            :
            <Button variant='contained' color='success' onClick={handlePostEditorialStepByStepUseful}>Hữu ích</Button>
          :
          <Button variant='contained' disabled={step >= maxStep} onClick={() => setStep(prev => prev < maxStep ? ++prev : maxStep)}>Tiếp tục</Button>
      } */}
    </Box>
  </Box>)
}

export default EditorialStepByStep
