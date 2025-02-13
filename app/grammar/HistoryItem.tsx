import { motion } from "motion/react";

interface HistoryRecord {
  input: string;
  completion: string;
}
interface HistoryItemProps {
  record: HistoryRecord;
  index: number;
  onSelected: (record: HistoryRecord) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  record,
  index,
  onSelected,
}) => {
  return (
    <motion.li
      key={index}
      className="space-y-2 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        x: [0, 10, 0],
      }}
      transition={{
        delay: index * 0.2, // 整体延迟
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2, // y 属性延迟
        },
        x: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2, // x 属性延迟
        },
      }}
      whileHover={{
        scale: 1.2,
      }}
    >
      <span
        className="inline-block max-w-[300px] truncate px-2 py-1 bg-blue-700 text-white rounded-lg cursor-pointer"
        title={record.input}
        onClick={onSelected && (() => onSelected(record))}
      >
        {record.input}
      </span>
    </motion.li>
  );
};

export default HistoryItem;
