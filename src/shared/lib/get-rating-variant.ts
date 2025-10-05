export const getRatingVariant = (rating: 'Отлично' | 'Хорошо' | 'Скрипт не использован' | 'Плохо' | null) => {
  switch (rating) {
    case 'Отлично':
      return 'great'
    case 'Плохо':
      return 'bad'
    case 'Хорошо':
      return 'good'
    case "Скрипт не использован":
      return "empty"
    default: return 'none'
  }
}

// 'Отлично' | 'Хорошо' | 'Скрипт не использован' | 'Плохо' | null