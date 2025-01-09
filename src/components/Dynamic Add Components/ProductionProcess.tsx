import {
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

interface ProductionProcessProps {
  inputs: any[];
  setInputs: (input: any) => void;
}

const ProductionProcess: React.FC<ProductionProcessProps> = ({
  inputs,
  setInputs,
}) => {
  const onChangeHandler = (isChecked: boolean, ind: number) => {
    const inputsArr = [...inputs];
    inputsArr[ind].done = isChecked;
    setInputs(inputsArr);
  };

  return (
    <div className="p-5">
    <FormLabel fontWeight="bold" fontSize="lg">Processes</FormLabel>
    <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-4">
      {inputs.map((input, ind) => (
        <li key={ind} className="flex items-center gap-2 w-full">
          <FormControl className="flex gap-1 items-center w-full">
            <Input
              isDisabled
              border="1px"
              borderColor="#a9a9a9"
              type="text"
              name="process"
              className="text-gray-900 w-full"
              value={input.process}
            />
            <input
              type="checkbox"
              className="h-[30px] w-[30px] text-blue-500"                            
              checked={input.done}
              onChange={(e) => onChangeHandler(e.target.checked, ind)}
            />
          </FormControl>
        </li>
      ))}
    </ul>
  </div>
  
  
  );
};

export default ProductionProcess;
