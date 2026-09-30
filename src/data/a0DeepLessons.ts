import { DeepLesson } from '../components/lesson/deepLessonTypes';

export const DEEP_A0_LESSONS: Record<string, DeepLesson> = {
  "l_a0_01": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Nhớ vài cách đọc quan trọng để không bị rối khi nhìn chữ tiếng Đức."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Nghe và đọc theo một số từ rất cơ bản."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Phân biệt được W, ei và ie ở mức cơ bản."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Trong từ German “Wasser”, chữ W gần âm nào nhất?",
        "answer": "v",
        "explanation": "W trong tiếng Đức đọc gần /v/.",
        "difficulty": 1,
        "options": [
          "v",
          "w",
          "b",
          "f"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Cặp chữ nào thường đọc gần /ai/?",
        "answer": "ei",
        "explanation": "ei đọc /ai/.",
        "difficulty": 1,
        "options": [
          "ei",
          "ie",
          "eu",
          "sch"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "W, V và J",
        "explanation": "Chỉ cần nhớ ba mẹo này trước. Chưa cần hiểu ký hiệu phát âm.",
        "pattern": "W ≈ v · V ≈ f · J ≈ y",
        "examples": [
          {
            "german": "Wasser",
            "vietnamese": "nước"
          },
          {
            "german": "Vater",
            "vietnamese": "bố"
          },
          {
            "german": "ja",
            "vietnamese": "vâng"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "Trong “ja”, chữ J nghe gần âm nào?",
            "answer": "y",
            "explanation": "J trong “ja” nghe gần giống âm y.",
            "difficulty": 1,
            "options": [
              "y",
              "j tiếng Anh",
              "ch",
              "z"
            ],
            "conceptId": "c01"
          }
        ],
        "trap": {
          "wrong": "Wasser → /wo.../",
          "correct": "Wasser → /va.../",
          "reason": "W tiếng Đức đọc gần V."
        }
      },
      {
        "id": "c02",
        "title": "ei, ie và eu",
        "explanation": "Hãy coi mỗi cụm là một âm riêng. Chỉ cần nghe và nhớ gần đúng.",
        "pattern": "ei ≈ ai · ie ≈ ii · eu/äu ≈ oi",
        "examples": [
          {
            "german": "mein",
            "vietnamese": "của tôi"
          },
          {
            "german": "Sie",
            "vietnamese": "Ngài / họ"
          },
          {
            "german": "Deutsch",
            "vietnamese": "tiếng Đức"
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "input",
            "skill": "pronunciation",
            "prompt": "Cụm chữ nào nghe gần như “ii” kéo dài?",
            "answer": "ie",
            "explanation": "ie thường nghe gần như “ii” kéo dài.",
            "difficulty": 1,
            "acceptedAnswers": [
              "IE"
            ],
            "conceptId": "c02"
          }
        ],
        "trap": {
          "wrong": "mein → /mi:n/",
          "correct": "mein → /main/",
          "reason": "ei đọc /ai/, còn ie mới đọc /i dài/."
        }
      },
      {
        "id": "c03",
        "title": "sch, ch và ß",
        "explanation": "Ở bài đầu chỉ cần nhớ: sch nghe gần “sh”, còn ß đọc gần như ss.",
        "pattern": "sch ≈ sh · ß ≈ ss",
        "examples": [
          {
            "german": "Schule",
            "vietnamese": "trường học"
          },
          {
            "german": "heißen",
            "vietnamese": "tên là"
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "“Schule” bắt đầu nghe gần âm nào?",
            "answer": "sh",
            "explanation": "sch nghe gần giống “sh”.",
            "difficulty": 1,
            "options": [
              "sh",
              "sk",
              "ch",
              "s"
            ],
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Trong “wohnen”, chữ W nghe gần âm nào?",
        "answer": "v",
        "explanation": "W nghe gần âm v.",
        "difficulty": 1,
        "options": [
          "v",
          "w",
          "b",
          "f"
        ]
      },
      {
        "id": "d02",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Trong “Vater”, chữ V nghe gần âm nào?",
        "answer": "f",
        "explanation": "V trong từ này nghe gần âm f.",
        "difficulty": 1,
        "options": [
          "f",
          "v",
          "w",
          "b"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "pronunciation",
        "prompt": "Cụm chữ nào nghe gần như “ai”?",
        "answer": "ei",
        "explanation": "ei nghe gần như “ai”.",
        "difficulty": 1
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "pronunciation",
        "prompt": "Cụm chữ nào nghe gần như “ii”?",
        "answer": "ie",
        "explanation": "ie nghe gần như “ii” kéo dài.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "choice",
        "skill": "listening",
        "prompt": "Nghe “mein”. Tổ hợp nguyên âm nào bạn nghe thấy?",
        "answer": "ei",
        "explanation": "mein có ei.",
        "difficulty": 2,
        "options": [
          "ei",
          "ie",
          "eu",
          "äu"
        ],
        "audioText": "mein"
      },
      {
        "id": "d06",
        "kind": "correct",
        "skill": "pronunciation",
        "prompt": "Sửa ghi chú sai: “Wasser bắt đầu bằng âm /w/.”",
        "answer": "Wasser bắt đầu bằng âm /v/",
        "explanation": "W tiếng Đức đọc gần /v/.",
        "difficulty": 2,
        "acceptedAnswers": [
          "Wasser bắt đầu bằng âm v",
          "Wasser bắt đầu với âm v"
        ]
      },
      {
        "id": "d07",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "“Deutsch” có “eu”, âm gần nhất là gì?",
        "answer": "oi",
        "explanation": "eu/äu thường đọc /oi/.",
        "difficulty": 2,
        "options": [
          "oi",
          "êu",
          "i",
          "ai"
        ]
      },
      {
        "id": "d08",
        "kind": "input",
        "skill": "pronunciation",
        "prompt": "ß tương đương gần nhất với hai chữ nào?",
        "answer": "ss",
        "explanation": "ß phát âm gần ss.",
        "difficulty": 2,
        "acceptedAnswers": [
          "SS"
        ]
      },
      {
        "id": "d09",
        "kind": "reorder",
        "skill": "production",
        "prompt": "Ghép quy tắc đúng thành chuỗi: ei / đọc / ai",
        "answer": "ei đọc ai",
        "explanation": "ei đọc ai.",
        "difficulty": 2,
        "words": [
          "ei",
          "đọc",
          "ai"
        ]
      },
      {
        "id": "d10",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Từ nào có âm đầu /sh/?",
        "answer": "Schule",
        "explanation": "Schule bắt đầu bằng sch.",
        "difficulty": 2,
        "options": [
          "Schule",
          "Wasser",
          "Vater",
          "ja"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Tự giải mã mặt chữ",
        "prompt": "Viết quy tắc đọc ngắn cho từ “mein”: phần “ei” đọc thế nào?",
        "hint": "Chỉ cần ghi âm gần đúng, ví dụ: ai.",
        "required": [
          "ai"
        ],
        "modelAnswer": "mein → /main/"
      },
      {
        "id": "p02",
        "title": "Phân loại nhanh",
        "prompt": "Viết một dòng theo mẫu: “ie = ..., ei = ..., eu = ...”",
        "hint": "Ba giá trị cần có: i dài, ai, oi.",
        "required": [
          "i",
          "ai",
          "oi"
        ],
        "modelAnswer": "ie = i dài, ei = ai, eu = oi"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nghe rồi nhại lại.",
        "target": "mein",
        "meaning": "của tôi",
        "minSimilarity": 0.55,
        "pronunciation": "[main]"
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nghe rồi nhại lại.",
        "target": "Sie",
        "meaning": "Ngài / họ",
        "minSimilarity": 0.55,
        "pronunciation": "[zii]"
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Nghe rồi nhại lại.",
        "target": "Deutsch",
        "meaning": "tiếng Đức",
        "minSimilarity": 0.5,
        "pronunciation": "[doitsh]"
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Đọc to câu ngắn này.",
        "target": "Ich heiße Minh.",
        "meaning": "Tôi tên là Minh.",
        "minSimilarity": 0.45,
        "pronunciation": "[ikh hai-sơ Minh]"
      }
    ],
    "challenge": {
      "id": "ch01",
      "title": "Đọc biển hiệu đầu tiên",
      "context": "Bạn nhìn thấy các từ quen thuộc trên biển hoặc giấy tờ ở Đức.",
      "goal": "Áp dụng quy tắc mặt chữ để nhận diện âm chính.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Từ “Wein” bắt đầu bằng âm nào và “ei” đọc gì?",
          "required": [
            "v",
            "ai"
          ],
          "sampleAnswer": "W → v, ei → ai.",
          "hint": "Nhớ W và ei."
        },
        {
          "id": "t2",
          "prompt": "Từ “Liebe” có “ie”. Hãy ghi âm chính của “ie”.",
          "required": [
            "i"
          ],
          "sampleAnswer": "ie → i dài.",
          "hint": "Đừng nhầm với ei."
        },
        {
          "id": "t3",
          "prompt": "Từ “Schule” bắt đầu bằng cụm âm nào?",
          "required": [
            "sh"
          ],
          "sampleAnswer": "sch → sh.",
          "hint": "Ba chữ sch đi cùng nhau."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "W tiếng Đức thường đọc gần âm nào?",
        "answer": "v",
        "explanation": "W → /v/.",
        "difficulty": 1,
        "options": [
          "v",
          "w",
          "f",
          "b"
        ]
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "pronunciation",
        "prompt": "Tổ hợp nào đọc /ai/?",
        "answer": "ei",
        "explanation": "ei → /ai/.",
        "difficulty": 1
      },
      {
        "id": "m03",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "Từ nào có “ie” đọc i dài?",
        "answer": "Sie",
        "explanation": "Sie có ie.",
        "difficulty": 2,
        "options": [
          "Sie",
          "mein",
          "Deutsch",
          "Wasser"
        ]
      },
      {
        "id": "m04",
        "kind": "input",
        "skill": "pronunciation",
        "prompt": "“eu” trong Deutsch đọc gần âm gì?",
        "answer": "oi",
        "explanation": "eu → /oi/.",
        "difficulty": 2,
        "acceptedAnswers": [
          "oy"
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "pronunciation",
        "prompt": "Sửa: “ja đọc bắt đầu bằng âm j tiếng Anh.”",
        "answer": "ja bắt đầu bằng âm y",
        "explanation": "J tiếng Đức đọc gần /y/.",
        "difficulty": 2,
        "acceptedAnswers": [
          "ja đọc bắt đầu bằng âm y"
        ]
      },
      {
        "id": "m06",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "ß gần với cách viết nào nhất?",
        "answer": "ss",
        "explanation": "ß gần ss.",
        "difficulty": 2,
        "options": [
          "ss",
          "sch",
          "ch",
          "z"
        ]
      },
      {
        "id": "m07",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "“Schule” bắt đầu gần âm nào?",
        "answer": "sh",
        "explanation": "sch → /sh/.",
        "difficulty": 2,
        "options": [
          "sh",
          "sk",
          "s",
          "k"
        ]
      }
    ],
    "remediation": [
      {
        "skill": "pronunciation",
        "title": "ei và ie",
        "explanation": "Nhìn thứ tự chữ: ei → ai, ie → i dài.",
        "retry": [
          {
            "id": "r01",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "“mein” dùng âm nào?",
            "answer": "ai",
            "explanation": "mein có ei.",
            "difficulty": 1,
            "options": [
              "ai",
              "i dài"
            ]
          },
          {
            "id": "r02",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "“Sie” dùng âm nào?",
            "answer": "i dài",
            "explanation": "Sie có ie.",
            "difficulty": 1,
            "options": [
              "i dài",
              "ai"
            ]
          }
        ]
      },
      {
        "skill": "listening",
        "title": "W / V / J",
        "explanation": "W→v, V→f, J→y.",
        "retry": [
          {
            "id": "r03",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "Wasser bắt đầu gần âm nào?",
            "answer": "v",
            "explanation": "W→v.",
            "difficulty": 1,
            "options": [
              "v",
              "w"
            ]
          },
          {
            "id": "r04",
            "kind": "choice",
            "skill": "pronunciation",
            "prompt": "ja bắt đầu gần âm nào?",
            "answer": "y",
            "explanation": "J→y.",
            "difficulty": 1,
            "options": [
              "y",
              "j tiếng Anh"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "W→v, V→f, J→y",
        "ei→ai, ie→i dài, eu/äu→oi",
        "sch→sh, ß≈ss"
      ],
      "canDo": [
        "Đọc được nhiều từ A0 theo mặt chữ",
        "Phân biệt ei và ie"
      ],
      "commonMistakes": [
        "Đọc W như tiếng Anh",
        "Đổi ei và ie cho nhau"
      ],
      "realGerman": [
        {
          "textbook": "Wie heißen Sie?",
          "natural": "Wie heißen Sie?",
          "note": "Ở A0, phát âm rõ từng từ trước; nối âm tự nhiên sẽ đến sau."
        }
      ],
      "nextLessonId": "l_a0_02"
    }
  },
  "l_a0_02": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Chọn lời chào/tạm biệt đúng theo thời điểm và mức độ lịch sự."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Tự chào và hỏi thăm một người trong tình huống đời thường."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Không dùng Gute Nacht như lời chào buổi tối thông thường."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "“Guten” bắt đầu bằng chữ G; mục tiêu bài này là gì?",
        "answer": "greeting",
        "explanation": "Nhận diện ngữ cảnh chào hỏi.",
        "difficulty": 1,
        "options": [
          "greeting",
          "number",
          "article",
          "country"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "Từ nào nghĩa là tạm biệt thân mật?",
        "answer": "Tschüss",
        "explanation": "Tschüss dùng thân mật.",
        "difficulty": 1,
        "options": [
          "Tschüss",
          "Hallo",
          "Danke",
          "Bitte"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Chào theo thời gian",
        "explanation": "Người Đức dùng lời chào theo thời điểm nhưng “Hallo” vẫn rất phổ biến trong môi trường thân mật.",
        "pattern": "Morgen → Guten Morgen · Ban ngày → Guten Tag · Tối → Guten Abend",
        "examples": [
          {
            "german": "Guten Morgen!",
            "vietnamese": "Chào buổi sáng!"
          },
          {
            "german": "Guten Abend!",
            "vietnamese": "Chào buổi tối!"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "choice",
            "skill": "communication",
            "prompt": "08:00 gặp giáo viên, lời chào phù hợp?",
            "answer": "Guten Morgen!",
            "explanation": "Buổi sáng dùng Guten Morgen.",
            "difficulty": 1,
            "options": [
              "Guten Morgen!",
              "Gute Nacht!",
              "Tschüss!",
              "Auf Wiedersehen!"
            ],
            "conceptId": "c01"
          }
        ],
        "trap": {
          "wrong": "Gute Nacht! lúc 19:00 khi vừa gặp nhau",
          "correct": "Guten Abend!",
          "reason": "Gute Nacht thường dùng khi chuẩn bị ngủ hoặc chia tay rất muộn."
        }
      },
      {
        "id": "c02",
        "title": "Thân mật và lịch sự",
        "explanation": "Với bạn bè dùng Hallo/Tschüss và du. Với người lạ hoặc tình huống trang trọng, Guten Tag/Auf Wiedersehen và Sie an toàn hơn.",
        "pattern": "du = thân mật · Sie = lịch sự",
        "examples": [
          {
            "german": "Hallo, wie geht's?",
            "vietnamese": "Chào, khỏe không?"
          },
          {
            "german": "Guten Tag. Wie geht es Ihnen?",
            "vietnamese": "Xin chào. Ngài khỏe không?"
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "choice",
            "skill": "communication",
            "prompt": "Gặp lễ tân khách sạn lần đầu, chọn câu tự nhiên hơn.",
            "answer": "Guten Tag. Wie geht es Ihnen?",
            "explanation": "Tình huống lịch sự ưu tiên Sie.",
            "difficulty": 1,
            "options": [
              "Guten Tag. Wie geht es Ihnen?",
              "Hey! Wie geht's, du?",
              "Tschüss!",
              "Gute Nacht!"
            ],
            "conceptId": "c02"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "choice",
        "skill": "communication",
        "prompt": "07:30 gặp hàng xóm lớn tuổi.",
        "answer": "Guten Morgen!",
        "explanation": "Buổi sáng.",
        "difficulty": 1,
        "options": [
          "Guten Morgen!",
          "Guten Abend!",
          "Gute Nacht!",
          "Tschüss!"
        ]
      },
      {
        "id": "d02",
        "kind": "choice",
        "skill": "communication",
        "prompt": "20:00 đến nhà hàng.",
        "answer": "Guten Abend!",
        "explanation": "Buổi tối.",
        "difficulty": 1,
        "options": [
          "Guten Abend!",
          "Guten Morgen!",
          "Gute Nacht!",
          "Auf Wiedersehen!"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "Gõ lời tạm biệt thân mật phổ biến.",
        "answer": "Tschüss",
        "explanation": "Tschüss.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Tschuess"
        ]
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "Hoàn thành: Auf ________.",
        "answer": "Wiedersehen",
        "explanation": "Auf Wiedersehen là tạm biệt lịch sự.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi sức khỏe thân mật tự nhiên?",
        "answer": "Wie geht's?",
        "explanation": "Wie geht's? rất tự nhiên với người quen.",
        "difficulty": 1,
        "options": [
          "Wie geht's?",
          "Wie heißen Sie?",
          "Woher kommen Sie?",
          "Gute Nacht?"
        ]
      },
      {
        "id": "d06",
        "kind": "correct",
        "skill": "communication",
        "prompt": "Sửa tình huống: “23:30 bạn rời nhà bạn rồi nói Guten Morgen.”",
        "answer": "Gute Nacht!",
        "explanation": "Đêm muộn/đi ngủ có thể dùng Gute Nacht.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Gute Nacht",
          "Tschüss"
        ]
      },
      {
        "id": "d07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp lời chúc: schönen / Tag / Einen",
        "answer": "Einen schönen Tag",
        "explanation": "Cụm cố định: Einen schönen Tag.",
        "difficulty": 1,
        "words": [
          "Einen",
          "schönen",
          "Tag"
        ]
      },
      {
        "id": "d08",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Tình huống nào hợp với Auf Wiedersehen?",
        "answer": "Rời quầy lễ tân sau khi nói chuyện",
        "explanation": "Auf Wiedersehen lịch sự.",
        "difficulty": 1,
        "options": [
          "Rời quầy lễ tân sau khi nói chuyện",
          "Nhắn bạn thân trên chat",
          "Chúc ngủ ngon cho con",
          "Hỏi giá bánh"
        ]
      },
      {
        "id": "d09",
        "kind": "input",
        "skill": "production",
        "prompt": "Điền: Guten ___, Frau Müller! (14:00)",
        "answer": "Tag",
        "explanation": "14:00 dùng Guten Tag.",
        "difficulty": 1
      },
      {
        "id": "d10",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Bạn bè cùng tuổi gặp nhau: lựa chọn ngắn và tự nhiên nhất?",
        "answer": "Hallo!",
        "explanation": "Hallo phù hợp.",
        "difficulty": 1,
        "options": [
          "Hallo!",
          "Auf Wiedersehen!",
          "Gute Nacht!",
          "Sehr geehrte Damen und Herren"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Chào giáo viên",
        "prompt": "Viết 2 câu: chào giáo viên lúc 09:00 và hỏi thăm lịch sự.",
        "hint": "Dùng Guten Morgen + Ihnen.",
        "required": [
          "Guten Morgen",
          "Ihnen"
        ],
        "modelAnswer": "Guten Morgen! Wie geht es Ihnen?"
      },
      {
        "id": "p02",
        "title": "Chào bạn",
        "prompt": "Viết một lời chào ngắn cho bạn thân rồi hỏi “khỏe không?”.",
        "hint": "Có thể dùng Hallo + Wie geht's.",
        "required": [
          "Hallo",
          "geht"
        ],
        "modelAnswer": "Hallo! Wie geht's?"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Guten Morgen!",
        "meaning": "Chào buổi sáng.",
        "minSimilarity": 0.65,
        "pronunciation": "[gu-ten mor-gen]"
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Auf Wiedersehen!",
        "meaning": "Tạm biệt.",
        "minSimilarity": 0.65,
        "pronunciation": "[auf vi-der-ze-hen]"
      },
      {
        "id": "s03",
        "mode": "respond",
        "prompt": "Bạn bè hỏi: “Hallo! Wie geht's?” Hãy trả lời.",
        "target": "Mir geht's gut, danke!",
        "meaning": "Tôi khỏe, cảm ơn.",
        "minSimilarity": 0.45,
        "pronunciation": "[miar gates guut, dang-kơ]"
      }
    ],
    "challenge": {
      "id": "ch02",
      "title": "Một ngày chào hỏi",
      "context": "Bạn gặp ba người trong một ngày.",
      "goal": "Chọn register và thời điểm phù hợp.",
      "turns": [
        {
          "id": "t1",
          "prompt": "08:10 gặp giáo viên. Viết lời chào.",
          "required": [
            "Guten Morgen"
          ],
          "sampleAnswer": "Guten Morgen!",
          "hint": "Buổi sáng."
        },
        {
          "id": "t2",
          "prompt": "15:00 gặp bạn thân. Viết lời chào ngắn.",
          "required": [
            "Hallo"
          ],
          "sampleAnswer": "Hallo!",
          "hint": "Thân mật."
        },
        {
          "id": "t3",
          "prompt": "21:30 rời nhà chủ nhà lớn tuổi. Viết lời tạm biệt.",
          "required": [
            "Wiedersehen"
          ],
          "sampleAnswer": "Auf Wiedersehen!",
          "hint": "Lịch sự khi rời đi."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "choice",
        "skill": "communication",
        "prompt": "09:00 gặp bác sĩ.",
        "answer": "Guten Morgen!",
        "explanation": "Buổi sáng.",
        "difficulty": 1,
        "options": [
          "Guten Morgen!",
          "Guten Abend!",
          "Gute Nacht!",
          "Tschüss!"
        ]
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "Tạm biệt lịch sự: Auf ________.",
        "answer": "Wiedersehen",
        "explanation": "Auf Wiedersehen.",
        "difficulty": 1
      },
      {
        "id": "m03",
        "kind": "choice",
        "skill": "communication",
        "prompt": "“Gute Nacht” dùng phù hợp nhất khi nào?",
        "answer": "Chuẩn bị đi ngủ hoặc chia tay rất muộn",
        "explanation": "Không phải lời chào tối chung.",
        "difficulty": 1,
        "options": [
          "Chuẩn bị đi ngủ hoặc chia tay rất muộn",
          "Bất cứ lúc nào sau 18h",
          "Buổi sáng",
          "Khi cảm ơn"
        ]
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "communication",
        "prompt": "Sửa cho lịch sự khi nói với người lạ: “Hallo, wie geht's?”",
        "answer": "Guten Tag. Wie geht es Ihnen?",
        "explanation": "Dùng Sie/Ihnen.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Guten Tag, wie geht es Ihnen?"
        ]
      },
      {
        "id": "m05",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: geht / es / Ihnen / Wie",
        "answer": "Wie geht es Ihnen",
        "explanation": "Câu lịch sự chuẩn.",
        "difficulty": 1,
        "words": [
          "Wie",
          "geht",
          "es",
          "Ihnen"
        ]
      },
      {
        "id": "m06",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết lời chào thân mật phổ biến.",
        "answer": "Hallo",
        "explanation": "Hallo.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Hi"
        ]
      },
      {
        "id": "m07",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu nào là tạm biệt thân mật?",
        "answer": "Tschüss!",
        "explanation": "Tschüss.",
        "difficulty": 1,
        "options": [
          "Tschüss!",
          "Guten Tag!",
          "Danke!",
          "Bitte!"
        ]
      }
    ],
    "remediation": [
      {
        "skill": "communication",
        "title": "Thời điểm chào",
        "explanation": "Morgen buổi sáng, Tag ban ngày, Abend buổi tối, Nacht khi ngủ/rời rất muộn.",
        "retry": [
          {
            "id": "r01",
            "kind": "choice",
            "skill": "communication",
            "prompt": "19:00 đến nhà hàng.",
            "answer": "Guten Abend!",
            "explanation": "Buổi tối.",
            "difficulty": 1,
            "options": [
              "Guten Abend!",
              "Gute Nacht!"
            ]
          },
          {
            "id": "r02",
            "kind": "choice",
            "skill": "communication",
            "prompt": "07:00 gặp hàng xóm.",
            "answer": "Guten Morgen!",
            "explanation": "Buổi sáng.",
            "difficulty": 1,
            "options": [
              "Guten Morgen!",
              "Guten Abend!"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "Guten Morgen/Tag/Abend",
        "Tschüss vs Auf Wiedersehen",
        "du vs Sie trong lời hỏi thăm"
      ],
      "canDo": [
        "Chào đúng thời điểm",
        "Chọn mức độ lịch sự"
      ],
      "commonMistakes": [
        "Dùng Gute Nacht để chào tối",
        "Dùng du với người lạ trong tình huống trang trọng"
      ],
      "realGerman": [
        {
          "textbook": "Wie geht es dir?",
          "natural": "Wie geht's?",
          "note": "Dạng rút gọn rất phổ biến khi nói thân mật."
        }
      ],
      "nextLessonId": "l_a0_03"
    }
  },
  "l_a0_03": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Dùng heißen, kommen aus, wohnen in và sprechen trong mẫu giới thiệu cơ bản."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Tự giới thiệu bằng 3–4 câu về tên, quê, nơi ở và ngôn ngữ."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Giữ động từ chia ở vị trí số 2 trong câu trần thuật cơ bản."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "Lời chào thân mật phổ biến?",
        "answer": "Hallo",
        "explanation": "Hallo.",
        "difficulty": 1
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi tên thân mật?",
        "answer": "Wie heißt du?",
        "explanation": "Wie heißt du? hỏi tên.",
        "difficulty": 1,
        "options": [
          "Wie heißt du?",
          "Wo wohnst du?",
          "Woher kommst du?",
          "Was kostet das?"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Tên: heißen",
        "explanation": "Dùng heißen để nói tên. Với ich: heiße; với du: heißt.",
        "pattern": "Ich heiße ... · Wie heißt du?",
        "examples": [
          {
            "german": "Ich heiße Lan.",
            "vietnamese": "Tôi tên Lan."
          },
          {
            "german": "Wie heißt du?",
            "vietnamese": "Bạn tên gì?"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Điền: Ich ___ Minh.",
            "answer": "heiße",
            "explanation": "Ich heiße ...",
            "difficulty": 1,
            "acceptedAnswers": [
              "heisse"
            ],
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "Nguồn gốc và nơi ở",
        "explanation": "Nguồn gốc dùng kommen aus. Nơi đang sống dùng wohnen in.",
        "pattern": "Ich komme aus ... · Ich wohne in ...",
        "examples": [
          {
            "german": "Ich komme aus Vietnam.",
            "vietnamese": "Tôi đến từ Việt Nam."
          },
          {
            "german": "Ich wohne in Berlin.",
            "vietnamese": "Tôi sống ở Berlin."
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Điền: Ich komme ___ Vietnam.",
            "answer": "aus",
            "explanation": "Nguồn gốc dùng aus.",
            "difficulty": 1,
            "options": [
              "aus",
              "in",
              "an",
              "bei"
            ],
            "conceptId": "c02"
          }
        ],
        "trap": {
          "wrong": "Ich wohne aus Berlin.",
          "correct": "Ich wohne in Berlin.",
          "reason": "wohnen dùng in cho nơi ở."
        }
      },
      {
        "id": "c03",
        "title": "Động từ ở vị trí 2",
        "explanation": "Trong câu trần thuật đơn giản, động từ chia đứng ở vị trí số 2. “Heute” có thể đứng đầu, nhưng verb vẫn ngay sau nó.",
        "pattern": "Position 1 + Verb + Subject/Rest",
        "examples": [
          {
            "german": "Ich lerne heute Deutsch.",
            "vietnamese": "Hôm nay tôi học tiếng Đức."
          },
          {
            "german": "Heute lerne ich Deutsch.",
            "vietnamese": "Hôm nay tôi học tiếng Đức."
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: Heute / ich / Deutsch / lerne",
            "answer": "Heute lerne ich Deutsch",
            "explanation": "Verb lerne ở vị trí 2.",
            "difficulty": 1,
            "words": [
              "Heute",
              "lerne",
              "ich",
              "Deutsch"
            ],
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ Mai. (heißen)",
        "answer": "heiße",
        "explanation": "ich heiße.",
        "difficulty": 1,
        "acceptedAnswers": [
          "heisse"
        ]
      },
      {
        "id": "d02",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Woher kommst du? — Ich komme ___ Vietnam.",
        "answer": "aus",
        "explanation": "kommen aus.",
        "difficulty": 1,
        "options": [
          "aus",
          "in",
          "nach",
          "bei"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich wohne ___ Hanoi.",
        "answer": "in",
        "explanation": "wohnen in.",
        "difficulty": 1
      },
      {
        "id": "d04",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "“sprechen” nghĩa gần nhất?",
        "answer": "nói",
        "explanation": "sprechen = nói.",
        "difficulty": 1,
        "options": [
          "nói",
          "sống",
          "đến",
          "tên là"
        ]
      },
      {
        "id": "d05",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: ich / in / Berlin / wohne",
        "answer": "Ich wohne in Berlin",
        "explanation": "Verb ở vị trí 2.",
        "difficulty": 1,
        "words": [
          "Ich",
          "wohne",
          "in",
          "Berlin"
        ]
      },
      {
        "id": "d06",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ich kommen aus Vietnam.”",
        "answer": "Ich komme aus Vietnam",
        "explanation": "ich → komme.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich komme aus Vietnam."
        ]
      },
      {
        "id": "d07",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi nói một chút tiếng Đức.",
        "answer": "Ich spreche ein bisschen Deutsch",
        "explanation": "Mẫu cố định.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche ein bisschen Deutsch."
        ]
      },
      {
        "id": "d08",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu nào trả lời “Wie heißt du?”",
        "answer": "Ich heiße Nam.",
        "explanation": "Hỏi tên → heißen.",
        "difficulty": 1,
        "options": [
          "Ich heiße Nam.",
          "Ich komme aus Vietnam.",
          "Ich wohne in Berlin.",
          "Ich bin 25 Jahre alt."
        ]
      },
      {
        "id": "d09",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa trật tự: “Heute ich lerne Deutsch.”",
        "answer": "Heute lerne ich Deutsch",
        "explanation": "Verb phải ở vị trí 2.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Heute lerne ich Deutsch."
        ]
      },
      {
        "id": "d10",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Điền: Ich ___ Vietnamesisch und lerne Deutsch.",
        "answer": "spreche",
        "explanation": "ich spreche.",
        "difficulty": 1
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Mini profile",
        "prompt": "Viết 3–4 câu giới thiệu thật về bạn: tên, quê, nơi sống và ngôn ngữ.",
        "hint": "Dùng Ich heiße / komme aus / wohne in / spreche.",
        "required": [
          "Ich",
          "heiße",
          "komme",
          "wohne"
        ],
        "modelAnswer": "Hallo! Ich heiße Minh. Ich komme aus Vietnam. Ich wohne in Hanoi. Ich spreche Vietnamesisch und lerne Deutsch."
      },
      {
        "id": "p02",
        "title": "Một câu với Heute",
        "prompt": "Viết một câu bắt đầu bằng “Heute” và giữ động từ ở vị trí 2.",
        "hint": "Mẫu: Heute lerne ich Deutsch.",
        "required": [
          "Heute"
        ],
        "modelAnswer": "Heute lerne ich Deutsch."
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich heiße Minh.",
        "meaning": "Tôi tên Minh.",
        "minSimilarity": 0.65,
        "pronunciation": "[ikh hai-sơ Minh]"
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich komme aus Vietnam.",
        "meaning": "Tôi đến từ Việt Nam.",
        "minSimilarity": 0.65,
        "pronunciation": "[ikh ko-mơ aus Vietnam]"
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich wohne in Hanoi.",
        "meaning": "Tôi sống ở Hà Nội.",
        "minSimilarity": 0.65,
        "pronunciation": "[ikh vo-nơ in Hanoi]"
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Trả lời câu hỏi: “Wie heißt du?”",
        "target": "Ich heiße Minh.",
        "meaning": "Tôi tên Minh.",
        "minSimilarity": 0.4
      }
    ],
    "challenge": {
      "id": "ch03",
      "title": "Gặp người mới ở lớp tiếng Đức",
      "context": "Một bạn cùng lớp hỏi thông tin cơ bản.",
      "goal": "Tự giới thiệu liên tục qua 3 lượt.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Wie heißt du?",
          "required": [
            "heiße"
          ],
          "sampleAnswer": "Ich heiße Minh.",
          "hint": "Dùng heißen.",
          "partner": "Lisa"
        },
        {
          "id": "t2",
          "prompt": "Woher kommst du?",
          "required": [
            "komme",
            "aus"
          ],
          "sampleAnswer": "Ich komme aus Vietnam.",
          "hint": "Dùng kommen aus.",
          "partner": "Lisa"
        },
        {
          "id": "t3",
          "prompt": "Wo wohnst du?",
          "required": [
            "wohne",
            "in"
          ],
          "sampleAnswer": "Ich wohne in Hanoi.",
          "hint": "Dùng wohnen in.",
          "partner": "Lisa"
        },
        {
          "id": "t4",
          "prompt": "Welche Sprachen sprichst du?",
          "required": [
            "spreche"
          ],
          "sampleAnswer": "Ich spreche Vietnamesisch und ein bisschen Deutsch.",
          "hint": "Dùng sprechen.",
          "partner": "Lisa"
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ Linh. (heißen)",
        "answer": "heiße",
        "explanation": "ich heiße.",
        "difficulty": 1,
        "acceptedAnswers": [
          "heisse"
        ]
      },
      {
        "id": "m02",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Nguồn gốc dùng giới từ nào?",
        "answer": "aus",
        "explanation": "kommen aus.",
        "difficulty": 1,
        "options": [
          "aus",
          "in",
          "bei",
          "an"
        ]
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi sống ở Berlin.",
        "answer": "Ich wohne in Berlin",
        "explanation": "wohnen in.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich wohne in Berlin."
        ]
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Heute ich spreche Deutsch.”",
        "answer": "Heute spreche ich Deutsch",
        "explanation": "Verb ở vị trí 2.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Heute spreche ich Deutsch."
        ]
      },
      {
        "id": "m05",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: aus / Ich / Vietnam / komme",
        "answer": "Ich komme aus Vietnam",
        "explanation": "Câu nguồn gốc.",
        "difficulty": 1,
        "words": [
          "Ich",
          "komme",
          "aus",
          "Vietnam"
        ]
      },
      {
        "id": "m06",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi nào hỏi nơi ở?",
        "answer": "Wo wohnst du?",
        "explanation": "wohnen = sống.",
        "difficulty": 1,
        "options": [
          "Wo wohnst du?",
          "Woher kommst du?",
          "Wie heißt du?",
          "Was sprichst du?"
        ]
      },
      {
        "id": "m07",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết câu: Tôi nói tiếng Việt.",
        "answer": "Ich spreche Vietnamesisch",
        "explanation": "sprechen + language.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch."
        ]
      },
      {
        "id": "m08",
        "kind": "choice",
        "skill": "word_order",
        "prompt": "Câu nào đúng?",
        "answer": "Heute lerne ich Deutsch.",
        "explanation": "Verb position 2.",
        "difficulty": 1,
        "options": [
          "Heute lerne ich Deutsch.",
          "Heute ich lerne Deutsch.",
          "Heute Deutsch ich lerne.",
          "Lerne heute ich Deutsch."
        ]
      }
    ],
    "remediation": [
      {
        "skill": "word_order",
        "title": "Động từ vị trí 2",
        "explanation": "Trong câu trần thuật cơ bản, verb chia ở vị trí số 2.",
        "retry": [
          {
            "id": "r01",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: Heute / wohne / ich / in Berlin",
            "answer": "Heute wohne ich in Berlin",
            "explanation": "Verb thứ 2.",
            "difficulty": 1,
            "words": [
              "Heute",
              "wohne",
              "ich",
              "in Berlin"
            ]
          },
          {
            "id": "r02",
            "kind": "correct",
            "skill": "word_order",
            "prompt": "Sửa: “Heute ich lerne.”",
            "answer": "Heute lerne ich",
            "explanation": "Verb thứ 2.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Heute lerne ich."
            ]
          }
        ]
      },
      {
        "skill": "grammar",
        "title": "aus và in",
        "explanation": "kommen aus = đến từ; wohnen in = sống ở.",
        "retry": [
          {
            "id": "r03",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Ich komme ___ Vietnam.",
            "answer": "aus",
            "explanation": "Nguồn gốc.",
            "difficulty": 1,
            "options": [
              "aus",
              "in"
            ]
          },
          {
            "id": "r04",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Ich wohne ___ Berlin.",
            "answer": "in",
            "explanation": "Nơi ở.",
            "difficulty": 1,
            "options": [
              "in",
              "aus"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "heißen",
        "kommen aus",
        "wohnen in",
        "sprechen",
        "verb position 2"
      ],
      "canDo": [
        "Tự giới thiệu 3–4 câu",
        "Hỏi và trả lời tên/quê/nơi ở"
      ],
      "commonMistakes": [
        "Ich kommen",
        "wohnen aus",
        "Heute ich lerne"
      ],
      "realGerman": [
        {
          "textbook": "Ich heiße Minh.",
          "natural": "Ich bin Minh.",
          "note": "Trong đời thường, người Đức cũng thường dùng “Ich bin ...” khi giới thiệu tên."
        }
      ],
      "nextLessonId": "l_a0_04"
    }
  },
  "l_a0_04": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Nhận biết số 0–20 và quy tắc hàng chục."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Đọc/viết số 21–99 theo thứ tự đơn vị + und + hàng chục."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Không đảo 21 thành zwanzigeins và nhớ dạng đặc biệt elf, zwölf, dreißig."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "11 là gì?",
        "answer": "elf",
        "explanation": "11=elf.",
        "difficulty": 1,
        "options": [
          "elf",
          "zwölf",
          "zehn",
          "eins"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "12 là gì?",
        "answer": "zwölf",
        "explanation": "12=zwölf.",
        "difficulty": 1,
        "options": [
          "zwölf",
          "elf",
          "zwanzig",
          "zwei"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Số gốc 0–20",
        "explanation": "0–12 nên học như từ vựng; 13–19 phần lớn kết thúc bằng -zehn.",
        "pattern": "0–12 học thuộc · 13–19 ≈ số đơn vị + zehn",
        "examples": [
          {
            "german": "elf",
            "vietnamese": "11"
          },
          {
            "german": "zwölf",
            "vietnamese": "12"
          },
          {
            "german": "sechzehn",
            "vietnamese": "16"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "vocabulary",
            "prompt": "12 = ?",
            "answer": "zwölf",
            "explanation": "12 là zwölf.",
            "difficulty": 1,
            "acceptedAnswers": [
              "zwoelf"
            ],
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "21–99 đọc ngược",
        "explanation": "Tiếng Đức nói đơn vị trước, rồi und, rồi hàng chục.",
        "pattern": "[đơn vị] + und + [hàng chục]",
        "examples": [
          {
            "german": "einundzwanzig",
            "vietnamese": "21"
          },
          {
            "german": "fünfundvierzig",
            "vietnamese": "45"
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "input",
            "skill": "production",
            "prompt": "Viết số 34 bằng tiếng Đức.",
            "answer": "vierunddreißig",
            "explanation": "4-und-30.",
            "difficulty": 1,
            "acceptedAnswers": [
              "vierunddreissig"
            ],
            "conceptId": "c02"
          }
        ],
        "trap": {
          "wrong": "zwanzigeins",
          "correct": "einundzwanzig",
          "reason": "21–99 nói đơn vị trước."
        }
      },
      {
        "id": "c03",
        "title": "Giá, phòng và số điện thoại",
        "explanation": "Số xuất hiện liên tục trong đời sống. Với giá và số phòng, cần vừa nhận ra digits vừa nghe được dạng tiếng Đức.",
        "pattern": "Zahl ↔ Wort",
        "examples": [
          {
            "german": "Zimmer 24",
            "vietnamese": "phòng 24"
          },
          {
            "german": "27 Euro",
            "vietnamese": "27 euro"
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "choice",
            "skill": "listening",
            "prompt": "Nghe “siebenundzwanzig”. Chọn số.",
            "answer": "27",
            "explanation": "7 + 20 = 27.",
            "difficulty": 1,
            "options": [
              "27",
              "72",
              "17",
              "20"
            ],
            "audioText": "siebenundzwanzig",
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "11 = ?",
        "answer": "elf",
        "explanation": "11=elf.",
        "difficulty": 1
      },
      {
        "id": "d02",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "12 = ?",
        "answer": "zwölf",
        "explanation": "12=zwölf.",
        "difficulty": 1,
        "acceptedAnswers": [
          "zwoelf"
        ]
      },
      {
        "id": "d03",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "30 viết đúng?",
        "answer": "dreißig",
        "explanation": "30=dreißig.",
        "difficulty": 1,
        "options": [
          "dreißig",
          "dreizig",
          "dreizehn",
          "dreiundzig"
        ]
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "production",
        "prompt": "21 = ?",
        "answer": "einundzwanzig",
        "explanation": "1+und+20.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "input",
        "skill": "production",
        "prompt": "45 = ?",
        "answer": "fünfundvierzig",
        "explanation": "5+und+40.",
        "difficulty": 1,
        "acceptedAnswers": [
          "fuenfundvierzig"
        ]
      },
      {
        "id": "d06",
        "kind": "choice",
        "skill": "listening",
        "prompt": "Nghe “vierunddreißig”.",
        "answer": "34",
        "explanation": "4+30.",
        "difficulty": 1,
        "options": [
          "34",
          "43",
          "24",
          "40"
        ],
        "audioText": "vierunddreißig"
      },
      {
        "id": "d07",
        "kind": "correct",
        "skill": "vocabulary",
        "prompt": "Sửa cách viết 21: “zwanzigeins”.",
        "answer": "einundzwanzig",
        "explanation": "Đơn vị đứng trước.",
        "difficulty": 1,
        "acceptedAnswers": [
          "einundzwanzig"
        ]
      },
      {
        "id": "d08",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Ghép 58: acht / und / fünfzig",
        "answer": "achtundfünfzig",
        "explanation": "8+und+50.",
        "difficulty": 1,
        "words": [
          "acht",
          "und",
          "fünfzig"
        ]
      },
      {
        "id": "d09",
        "kind": "choice",
        "skill": "communication",
        "prompt": "“Zimmer zweiundvierzig” là phòng nào?",
        "answer": "42",
        "explanation": "2+40.",
        "difficulty": 1,
        "options": [
          "42",
          "24",
          "22",
          "40"
        ]
      },
      {
        "id": "d10",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết 99 bằng tiếng Đức.",
        "answer": "neunundneunzig",
        "explanation": "9+und+90.",
        "difficulty": 1
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Giá tiền",
        "prompt": "Viết bằng tiếng Đức: 27 Euro.",
        "hint": "Đọc 7 trước rồi 20.",
        "required": [
          "sieben",
          "zwanzig"
        ],
        "modelAnswer": "siebenundzwanzig Euro"
      },
      {
        "id": "p02",
        "title": "Số phòng",
        "prompt": "Viết “Phòng 42” bằng tiếng Đức.",
        "hint": "Zimmer + số.",
        "required": [
          "Zimmer"
        ],
        "modelAnswer": "Zimmer zweiundvierzig"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Đọc số.",
        "target": "zwölf",
        "meaning": "12",
        "minSimilarity": 0.45,
        "pronunciation": "[tsvơlf]"
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Đọc số.",
        "target": "einundzwanzig",
        "meaning": "21",
        "minSimilarity": 0.4,
        "pronunciation": "[ain-unt-tsvan-tsikh]"
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Đọc số.",
        "target": "fünfundvierzig Euro",
        "meaning": "45 euro",
        "minSimilarity": 0.35
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Đọc to số phòng 37.",
        "target": "Zimmer siebenunddreißig",
        "meaning": "Phòng 37",
        "minSimilarity": 0.3
      }
    ],
    "challenge": {
      "id": "ch04",
      "title": "Nhận phòng khách sạn",
      "context": "Lễ tân đưa cho bạn số phòng và giá.",
      "goal": "Hiểu và tạo số trong ngữ cảnh thật.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Phòng của bạn là 24. Viết bằng tiếng Đức.",
          "required": [
            "vierundzwanzig"
          ],
          "sampleAnswer": "Zimmer vierundzwanzig.",
          "hint": "4 + 20."
        },
        {
          "id": "t2",
          "prompt": "Giá là 38 Euro. Viết số bằng tiếng Đức.",
          "required": [
            "achtunddreißig"
          ],
          "sampleAnswer": "achtunddreißig Euro.",
          "hint": "8 + 30."
        },
        {
          "id": "t3",
          "prompt": "Bạn nghe “einundfünfzig”. Viết digits.",
          "required": [
            "51"
          ],
          "sampleAnswer": "51",
          "hint": "1 + 50."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "vocabulary",
        "prompt": "12 = ?",
        "answer": "zwölf",
        "explanation": "12=zwölf.",
        "difficulty": 1,
        "acceptedAnswers": [
          "zwoelf"
        ]
      },
      {
        "id": "m02",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "30 = ?",
        "answer": "dreißig",
        "explanation": "30 đặc biệt.",
        "difficulty": 1,
        "options": [
          "dreißig",
          "dreizig",
          "dreizehn",
          "dreiundzwanzig"
        ]
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "production",
        "prompt": "28 = ?",
        "answer": "achtundzwanzig",
        "explanation": "8+20.",
        "difficulty": 1
      },
      {
        "id": "m04",
        "kind": "input",
        "skill": "production",
        "prompt": "63 = ?",
        "answer": "dreiundsechzig",
        "explanation": "3+60.",
        "difficulty": 1
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "vocabulary",
        "prompt": "Sửa: 47 = vierzigundsieben.",
        "answer": "siebenundvierzig",
        "explanation": "Đơn vị trước.",
        "difficulty": 1,
        "acceptedAnswers": [
          "siebenundvierzig"
        ]
      },
      {
        "id": "m06",
        "kind": "choice",
        "skill": "listening",
        "prompt": "Nghe “neununddreißig”.",
        "answer": "39",
        "explanation": "9+30.",
        "difficulty": 1,
        "options": [
          "39",
          "93",
          "29",
          "30"
        ],
        "audioText": "neununddreißig"
      },
      {
        "id": "m07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Ghép 52.",
        "answer": "zweiundfünfzig",
        "explanation": "2+50.",
        "difficulty": 1,
        "words": [
          "zwei",
          "und",
          "fünfzig"
        ]
      },
      {
        "id": "m08",
        "kind": "input",
        "skill": "production",
        "prompt": "99 = ?",
        "answer": "neunundneunzig",
        "explanation": "9+90.",
        "difficulty": 1
      }
    ],
    "remediation": [
      {
        "skill": "vocabulary",
        "title": "Đơn vị đứng trước",
        "explanation": "Từ 21–99: đơn vị + und + hàng chục.",
        "retry": [
          {
            "id": "r01",
            "kind": "input",
            "skill": "production",
            "prompt": "21 = ?",
            "answer": "einundzwanzig",
            "explanation": "1+20.",
            "difficulty": 1
          },
          {
            "id": "r02",
            "kind": "input",
            "skill": "production",
            "prompt": "34 = ?",
            "answer": "vierunddreißig",
            "explanation": "4+30.",
            "difficulty": 1,
            "acceptedAnswers": [
              "vierunddreissig"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "elf, zwölf",
        "hàng chục",
        "đơn vị + und + hàng chục"
      ],
      "canDo": [
        "Đọc giá cơ bản",
        "Đọc số phòng",
        "Viết 21–99"
      ],
      "commonMistakes": [
        "Đặt hàng chục trước",
        "Viết dreißig thành dreizig"
      ],
      "realGerman": [
        {
          "textbook": "siebenundzwanzig Euro",
          "natural": "siebenundzwanzig Euro",
          "note": "Khi nói giá, nhịp thường nhanh hơn nhưng cấu trúc số không đổi."
        }
      ],
      "nextLessonId": "l_a0_05"
    }
  },
  "l_a0_05": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Dùng kommen aus và sprechen với quốc gia/ngôn ngữ phổ biến."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Nói quê hương và ngôn ngữ của bản thân."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Học “aus der Schweiz” như một chunk thay vì cố suy luận Dativ ở A0."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich komme ___ Vietnam.",
        "answer": "aus",
        "explanation": "kommen aus.",
        "difficulty": 1
      },
      {
        "id": "w02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ Vietnamesisch.",
        "answer": "spreche",
        "explanation": "ich spreche.",
        "difficulty": 1
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Quốc gia không article",
        "explanation": "Đa số tên quốc gia cơ bản dùng trực tiếp sau aus.",
        "pattern": "aus + Deutschland/Vietnam/Österreich",
        "examples": [
          {
            "german": "Ich komme aus Vietnam.",
            "vietnamese": "Tôi đến từ Việt Nam."
          },
          {
            "german": "Ich komme aus Deutschland.",
            "vietnamese": "Tôi đến từ Đức."
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Ich komme ___ Deutschland.",
            "answer": "aus",
            "explanation": "kommen aus.",
            "difficulty": 1,
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "Một vài chunk có article",
        "explanation": "Ở A0, hãy học cả cụm thay vì học Dativ sâu: aus der Schweiz, aus der Türkei.",
        "pattern": "aus der Schweiz",
        "examples": [
          {
            "german": "Ich komme aus der Schweiz.",
            "vietnamese": "Tôi đến từ Thụy Sĩ."
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Cụm đúng cho Thụy Sĩ?",
            "answer": "aus der Schweiz",
            "explanation": "Học nguyên chunk.",
            "difficulty": 1,
            "options": [
              "aus der Schweiz",
              "aus die Schweiz",
              "in der Schweiz kommen",
              "aus Schweiz"
            ],
            "conceptId": "c02"
          }
        ]
      },
      {
        "id": "c03",
        "title": "Ngôn ngữ",
        "explanation": "Dùng sprechen + ngôn ngữ. Với ich: spreche.",
        "pattern": "Ich spreche + Sprache",
        "examples": [
          {
            "german": "Ich spreche Vietnamesisch.",
            "vietnamese": "Tôi nói tiếng Việt."
          },
          {
            "german": "Ich spreche ein bisschen Deutsch.",
            "vietnamese": "Tôi nói một chút tiếng Đức."
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Ich ___ Deutsch.",
            "answer": "spreche",
            "explanation": "ich spreche.",
            "difficulty": 1,
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich komme ___ Vietnam.",
        "answer": "aus",
        "explanation": "kommen aus.",
        "difficulty": 1
      },
      {
        "id": "d02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich komme aus ___ Schweiz.",
        "answer": "der",
        "explanation": "Chunk: aus der Schweiz.",
        "difficulty": 1
      },
      {
        "id": "d03",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "Deutsch là gì?",
        "answer": "tiếng Đức",
        "explanation": "Deutsch = tiếng Đức.",
        "difficulty": 1,
        "options": [
          "tiếng Đức",
          "nước Đức",
          "người Đức",
          "Berlin"
        ]
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi nói tiếng Việt.",
        "answer": "Ich spreche Vietnamesisch",
        "explanation": "sprechen + language.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch."
        ]
      },
      {
        "id": "d05",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ich sprechen Deutsch.”",
        "answer": "Ich spreche Deutsch",
        "explanation": "ich → spreche.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Deutsch."
        ]
      },
      {
        "id": "d06",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu nào nói “Tôi đến từ Đức”?",
        "answer": "Ich komme aus Deutschland.",
        "explanation": "Nguồn gốc.",
        "difficulty": 1,
        "options": [
          "Ich komme aus Deutschland.",
          "Ich wohne Deutschland.",
          "Ich spreche Deutschland.",
          "Ich heiße Deutschland."
        ]
      },
      {
        "id": "d07",
        "kind": "input",
        "skill": "production",
        "prompt": "Hoàn thành: Ich spreche ___ bisschen Deutsch.",
        "answer": "ein",
        "explanation": "ein bisschen.",
        "difficulty": 1
      },
      {
        "id": "d08",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa câu lẫn ngôn ngữ: “Ich spreche Vietnamesisch và lerne Deutsch.”",
        "answer": "Ich spreche Vietnamesisch und lerne Deutsch",
        "explanation": "und là “và” trong tiếng Đức.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch und lerne Deutsch."
        ]
      },
      {
        "id": "d09",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: komme / Ich / aus / Vietnam",
        "answer": "Ich komme aus Vietnam",
        "explanation": "Verb vị trí 2.",
        "difficulty": 1,
        "words": [
          "Ich",
          "komme",
          "aus",
          "Vietnam"
        ]
      },
      {
        "id": "d10",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Cụm nào nên học như một chunk ở A0?",
        "answer": "aus der Schweiz",
        "explanation": "Không cần mở Dativ sâu.",
        "difficulty": 1,
        "options": [
          "aus der Schweiz",
          "Schweiz der aus",
          "aus die Schweiz",
          "der Schweiz aus"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Quê hương",
        "prompt": "Viết 2 câu thật về bạn: bạn đến từ đâu và bạn nói ngôn ngữ gì.",
        "hint": "Dùng komme aus + spreche.",
        "required": [
          "komme",
          "aus",
          "spreche"
        ],
        "modelAnswer": "Ich komme aus Vietnam. Ich spreche Vietnamesisch."
      },
      {
        "id": "p02",
        "title": "Ngôn ngữ đang học",
        "prompt": "Viết: Tôi nói tiếng Việt và đang học tiếng Đức.",
        "hint": "Dùng und.",
        "required": [
          "Vietnamesisch",
          "und",
          "Deutsch"
        ],
        "modelAnswer": "Ich spreche Vietnamesisch und lerne Deutsch."
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich komme aus Vietnam.",
        "meaning": "Tôi đến từ Việt Nam.",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich spreche Vietnamesisch.",
        "meaning": "Tôi nói tiếng Việt.",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "respond",
        "prompt": "Trả lời: “Woher kommst du?”",
        "target": "Ich komme aus Vietnam.",
        "meaning": "Tôi đến từ Việt Nam.",
        "minSimilarity": 0.4
      }
    ],
    "challenge": {
      "id": "ch05",
      "title": "Làm quen ở lớp quốc tế",
      "context": "Bạn nói chuyện với một người bạn mới.",
      "goal": "Nói quê hương và ngôn ngữ.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Woher kommst du?",
          "required": [
            "komme",
            "aus"
          ],
          "sampleAnswer": "Ich komme aus Vietnam.",
          "hint": "Nguồn gốc."
        },
        {
          "id": "t2",
          "prompt": "Welche Sprache sprichst du?",
          "required": [
            "spreche"
          ],
          "sampleAnswer": "Ich spreche Vietnamesisch.",
          "hint": "Ngôn ngữ."
        },
        {
          "id": "t3",
          "prompt": "Lernst du Deutsch?",
          "required": [
            "lerne",
            "Deutsch"
          ],
          "sampleAnswer": "Ja, ich lerne Deutsch.",
          "hint": "Trả lời ngắn."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich komme ___ Vietnam.",
        "answer": "aus",
        "explanation": "kommen aus.",
        "difficulty": 1
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich spreche ___ bisschen Deutsch.",
        "answer": "ein",
        "explanation": "ein bisschen.",
        "difficulty": 1
      },
      {
        "id": "m03",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Cụm đúng?",
        "answer": "aus der Schweiz",
        "explanation": "Chunk đúng.",
        "difficulty": 1,
        "options": [
          "aus der Schweiz",
          "aus die Schweiz",
          "aus Schweiz der",
          "aus das Schweiz"
        ]
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ich sprechen Englisch.”",
        "answer": "Ich spreche Englisch",
        "explanation": "ich spreche.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Englisch."
        ]
      },
      {
        "id": "m05",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi đến từ Đức.",
        "answer": "Ich komme aus Deutschland",
        "explanation": "kommen aus.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich komme aus Deutschland."
        ]
      },
      {
        "id": "m06",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi nói tiếng Việt.",
        "answer": "Ich spreche Vietnamesisch",
        "explanation": "sprechen.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch."
        ]
      },
      {
        "id": "m07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: aus / komme / Ich / Österreich",
        "answer": "Ich komme aus Österreich",
        "explanation": "Nguồn gốc.",
        "difficulty": 1,
        "words": [
          "Ich",
          "komme",
          "aus",
          "Österreich"
        ]
      },
      {
        "id": "m08",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa: “Ich spreche Vietnamesisch và Deutsch.”",
        "answer": "Ich spreche Vietnamesisch und Deutsch",
        "explanation": "und là tiếng Đức.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch und Deutsch."
        ]
      }
    ],
    "remediation": [
      {
        "skill": "grammar",
        "title": "kommen aus vs sprechen",
        "explanation": "Quê hương: kommen aus. Ngôn ngữ: sprechen.",
        "retry": [
          {
            "id": "r01",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Ich ___ aus Vietnam.",
            "answer": "komme",
            "explanation": "kommen aus.",
            "difficulty": 1,
            "options": [
              "komme",
              "spreche"
            ]
          },
          {
            "id": "r02",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Ich ___ Deutsch.",
            "answer": "spreche",
            "explanation": "sprechen language.",
            "difficulty": 1,
            "options": [
              "spreche",
              "komme"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "kommen aus",
        "sprechen + ngôn ngữ",
        "aus der Schweiz như chunk"
      ],
      "canDo": [
        "Nói quê hương",
        "Nói ngôn ngữ",
        "Nói mình đang học tiếng Đức"
      ],
      "commonMistakes": [
        "Ich sprechen",
        "aus die Schweiz",
        "lẫn từ Việt trong câu Đức"
      ],
      "realGerman": [
        {
          "textbook": "Ich spreche ein bisschen Deutsch.",
          "natural": "Ich spreche ein bisschen Deutsch.",
          "note": "Đây là câu rất tự nhiên và hữu ích cho người mới học."
        }
      ],
      "nextLessonId": "l_a0_06"
    }
  },
  "l_a0_06": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Chia sein ở các ngôi A0 cốt lõi."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Dùng sein để nói danh tính, trạng thái, vị trí và tuổi."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Không nhầm ihr seid với sie/Sie sind và không dùng haben để nói tuổi."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "“ich” là ngôi nào?",
        "answer": "tôi",
        "explanation": "ich=tôi.",
        "difficulty": 1,
        "options": [
          "tôi",
          "bạn",
          "anh ấy",
          "chúng tôi"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "vocabulary",
        "prompt": "“du” là?",
        "answer": "bạn thân mật",
        "explanation": "du=bạn thân mật.",
        "difficulty": 1,
        "options": [
          "bạn thân mật",
          "Ngài lịch sự",
          "họ",
          "chúng tôi"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "ich và du",
        "explanation": "Hai dạng đầu tiên cần phản xạ: ich bin, du bist.",
        "pattern": "ich bin · du bist",
        "examples": [
          {
            "german": "Ich bin müde.",
            "vietnamese": "Tôi mệt."
          },
          {
            "german": "Du bist nett.",
            "vietnamese": "Bạn tốt bụng."
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Du ___ nett.",
            "answer": "bist",
            "explanation": "du bist.",
            "difficulty": 1,
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "er / sie / es",
        "explanation": "Ba ngôi số ít này cùng dùng ist.",
        "pattern": "er/sie/es ist",
        "examples": [
          {
            "german": "Er ist Lehrer.",
            "vietnamese": "Anh ấy là giáo viên."
          },
          {
            "german": "Sie ist müde.",
            "vietnamese": "Cô ấy mệt."
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Er ___ in Berlin.",
            "answer": "ist",
            "explanation": "er ist.",
            "difficulty": 1,
            "conceptId": "c02"
          }
        ]
      },
      {
        "id": "c03",
        "title": "Số nhiều và Sie",
        "explanation": "wir sind, ihr seid, sie sind, Sie sind. Điểm dễ nhầm nhất là ihr seid.",
        "pattern": "wir sind · ihr seid · sie/Sie sind",
        "examples": [
          {
            "german": "Wir sind hier.",
            "vietnamese": "Chúng tôi ở đây."
          },
          {
            "german": "Ihr seid spät.",
            "vietnamese": "Các bạn đến muộn."
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Ihr ___ sehr nett.",
            "answer": "seid",
            "explanation": "ihr seid.",
            "difficulty": 1,
            "conceptId": "c03"
          }
        ],
        "trap": {
          "wrong": "Ihr sind nett.",
          "correct": "Ihr seid nett.",
          "reason": "ihr có dạng riêng seid."
        }
      },
      {
        "id": "c04",
        "title": "Bốn cách dùng cốt lõi",
        "explanation": "Ở A0, dùng sein cho danh tính/nghề, trạng thái, vị trí và tuổi.",
        "pattern": "sein + noun/adjective/place/age",
        "examples": [
          {
            "german": "Ich bin Student.",
            "vietnamese": "Tôi là sinh viên."
          },
          {
            "german": "Ich bin müde.",
            "vietnamese": "Tôi mệt."
          },
          {
            "german": "Ich bin in Hanoi.",
            "vietnamese": "Tôi ở Hà Nội."
          },
          {
            "german": "Ich bin 25 Jahre alt.",
            "vietnamese": "Tôi 25 tuổi."
          }
        ],
        "checkpoint": [
          {
            "id": "c04q",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Câu nói tuổi đúng?",
            "answer": "Ich bin 25 Jahre alt.",
            "explanation": "Tiếng Đức dùng sein cho tuổi.",
            "difficulty": 1,
            "options": [
              "Ich bin 25 Jahre alt.",
              "Ich habe 25 Jahre alt.",
              "Ich mache 25 Jahre alt.",
              "Ich heiße 25 Jahre."
            ],
            "conceptId": "c04"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ müde.",
        "answer": "bin",
        "explanation": "ich bin.",
        "difficulty": 1
      },
      {
        "id": "d02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Du ___ freundlich.",
        "answer": "bist",
        "explanation": "du bist.",
        "difficulty": 1
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Er ___ Lehrer.",
        "answer": "ist",
        "explanation": "er ist.",
        "difficulty": 1
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Wir ___ in Berlin.",
        "answer": "sind",
        "explanation": "wir sind.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ihr ___ spät.",
        "answer": "seid",
        "explanation": "ihr seid.",
        "difficulty": 1
      },
      {
        "id": "d06",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Sie (lịch sự) ___ Frau Müller.",
        "answer": "sind",
        "explanation": "Sie sind.",
        "difficulty": 1,
        "options": [
          "sind",
          "seid",
          "ist",
          "bist"
        ]
      },
      {
        "id": "d07",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Er sind mein Freund.”",
        "answer": "Er ist mein Freund",
        "explanation": "er ist.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Er ist mein Freund."
        ]
      },
      {
        "id": "d08",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ihr sind sehr nett.”",
        "answer": "Ihr seid sehr nett",
        "explanation": "ihr seid.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ihr seid sehr nett."
        ]
      },
      {
        "id": "d09",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi 24 tuổi.",
        "answer": "Ich bin 24 Jahre alt",
        "explanation": "Dùng sein cho tuổi.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich bin 24 Jahre alt."
        ]
      },
      {
        "id": "d10",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Bạn đang mệt. Câu đúng?",
        "answer": "Ich bin müde.",
        "explanation": "State dùng sein.",
        "difficulty": 1,
        "options": [
          "Ich bin müde.",
          "Ich habe müde.",
          "Ich heiße müde.",
          "Ich komme müde."
        ]
      },
      {
        "id": "d11",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: in / Wir / Berlin / sind",
        "answer": "Wir sind in Berlin",
        "explanation": "wir sind.",
        "difficulty": 1,
        "words": [
          "Wir",
          "sind",
          "in",
          "Berlin"
        ]
      },
      {
        "id": "d12",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Các bạn rất thân thiện.",
        "answer": "Ihr seid sehr freundlich",
        "explanation": "ihr seid.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ihr seid sehr freundlich."
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Ba câu thật về bạn",
        "prompt": "Viết 3 câu với sein: nghề/danh tính, tuổi, trạng thái hôm nay.",
        "hint": "Dùng Ich bin ... ở cả ba câu.",
        "required": [
          "Ich bin"
        ],
        "modelAnswer": "Ich bin Student. Ich bin 25 Jahre alt. Heute bin ich müde."
      },
      {
        "id": "p02",
        "title": "Một câu số nhiều",
        "prompt": "Viết một câu với “wir sind” hoặc “ihr seid”.",
        "hint": "Ví dụ: Wir sind in Hanoi.",
        "required": [
          "sind"
        ],
        "modelAnswer": "Wir sind in Hanoi."
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich bin Student.",
        "meaning": "Tôi là sinh viên.",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich bin 25 Jahre alt.",
        "meaning": "Tôi 25 tuổi.",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ihr seid sehr nett.",
        "meaning": "Các bạn rất tốt.",
        "minSimilarity": 0.65
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Trả lời: “Wie alt bist du?”",
        "target": "Ich bin 25 Jahre alt.",
        "meaning": "Tôi 25 tuổi.",
        "minSimilarity": 0.35
      }
    ],
    "challenge": {
      "id": "ch06",
      "title": "Giới thiệu bản thân bằng sein",
      "context": "Bạn gặp đồng nghiệp mới.",
      "goal": "Dùng nhiều chức năng của sein.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Wer bist du? Hãy nói nghề hoặc vai trò.",
          "required": [
            "bin"
          ],
          "sampleAnswer": "Ich bin Student.",
          "hint": "Dùng Ich bin."
        },
        {
          "id": "t2",
          "prompt": "Wie alt bist du?",
          "required": [
            "bin",
            "Jahre alt"
          ],
          "sampleAnswer": "Ich bin 25 Jahre alt.",
          "hint": "Tuổi dùng sein."
        },
        {
          "id": "t3",
          "prompt": "Wie bist du heute?",
          "required": [
            "bin"
          ],
          "sampleAnswer": "Heute bin ich müde.",
          "hint": "Nói trạng thái."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "du + sein = ?",
        "answer": "bist",
        "explanation": "du bist.",
        "difficulty": 1
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "ihr + sein = ?",
        "answer": "seid",
        "explanation": "ihr seid.",
        "difficulty": 1
      },
      {
        "id": "m03",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Sie (lịch sự) + sein = ?",
        "answer": "sind",
        "explanation": "Sie sind.",
        "difficulty": 1,
        "options": [
          "sind",
          "seid",
          "ist",
          "bist"
        ]
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Wir seid in Berlin.”",
        "answer": "Wir sind in Berlin",
        "explanation": "wir sind.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wir sind in Berlin."
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ich habe 30 Jahre alt.”",
        "answer": "Ich bin 30 Jahre alt",
        "explanation": "Tuổi dùng sein.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich bin 30 Jahre alt."
        ]
      },
      {
        "id": "m06",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Anh ấy là giáo viên.",
        "answer": "Er ist Lehrer",
        "explanation": "er ist.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Er ist Lehrer."
        ]
      },
      {
        "id": "m07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: müde / Heute / ich / bin",
        "answer": "Heute bin ich müde",
        "explanation": "Verb vị trí 2.",
        "difficulty": 1,
        "words": [
          "Heute",
          "bin",
          "ich",
          "müde"
        ]
      },
      {
        "id": "m08",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Các bạn rất tốt bụng.",
        "answer": "Ihr seid sehr nett",
        "explanation": "ihr seid.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ihr seid sehr nett."
        ]
      }
    ],
    "remediation": [
      {
        "skill": "grammar",
        "title": "seid hay sind?",
        "explanation": "wir/sie/Sie dùng sind; riêng ihr dùng seid.",
        "retry": [
          {
            "id": "r01",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Ihr ___ hier.",
            "answer": "seid",
            "explanation": "ihr seid.",
            "difficulty": 1
          },
          {
            "id": "r02",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Wir ___ hier.",
            "answer": "sind",
            "explanation": "wir sind.",
            "difficulty": 1
          }
        ]
      },
      {
        "skill": "production",
        "title": "Nói tuổi",
        "explanation": "Tiếng Đức dùng sein: Ich bin ... Jahre alt.",
        "retry": [
          {
            "id": "r03",
            "kind": "correct",
            "skill": "grammar",
            "prompt": "Sửa: “Ich habe 20 Jahre alt.”",
            "answer": "Ich bin 20 Jahre alt",
            "explanation": "sein cho tuổi.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Ich bin 20 Jahre alt."
            ]
          },
          {
            "id": "r04",
            "kind": "input",
            "skill": "production",
            "prompt": "Dịch: Tôi 19 tuổi.",
            "answer": "Ich bin 19 Jahre alt",
            "explanation": "sein cho tuổi.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Ich bin 19 Jahre alt."
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "bin/bist/ist/sind/seid/sind",
        "sein cho danh tính, trạng thái, vị trí, tuổi"
      ],
      "canDo": [
        "Nói tuổi",
        "Nói trạng thái",
        "Dùng đủ ngôi cơ bản"
      ],
      "commonMistakes": [
        "ihr sind",
        "Ich habe ... Jahre alt"
      ],
      "realGerman": [
        {
          "textbook": "Ich bin sehr müde.",
          "natural": "Ich bin echt müde.",
          "note": "echt thường được dùng trong lời nói đời thường với nghĩa “thật sự/rất”."
        }
      ],
      "nextLessonId": "l_a0_07"
    }
  },
  "l_a0_07": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Chia haben ở các ngôi cơ bản."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Dùng haben cho sở hữu và các cụm Hunger, Durst, Zeit, Frage."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Không nói Ich bin Hunger và nhớ du hast / er hat."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ Student. (sein)",
        "answer": "bin",
        "explanation": "Ôn sein.",
        "difficulty": 1
      },
      {
        "id": "w02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Du ___ nett. (sein)",
        "answer": "bist",
        "explanation": "Ôn sein.",
        "difficulty": 1
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "ich / du / er",
        "explanation": "Ba dạng quan trọng nhất: ich habe, du hast, er/sie/es hat.",
        "pattern": "ich habe · du hast · er/sie/es hat",
        "examples": [
          {
            "german": "Ich habe Zeit.",
            "vietnamese": "Tôi có thời gian."
          },
          {
            "german": "Du hast Hunger.",
            "vietnamese": "Bạn đói."
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Er ___ ein Auto.",
            "answer": "hat",
            "explanation": "er hat.",
            "difficulty": 1,
            "conceptId": "c01"
          }
        ],
        "trap": {
          "wrong": "du habst",
          "correct": "du hast",
          "reason": "du và er/sie/es là dạng bất quy tắc ngắn."
        }
      },
      {
        "id": "c02",
        "title": "Số nhiều",
        "explanation": "wir haben, ihr habt, sie/Sie haben.",
        "pattern": "wir/sie/Sie haben · ihr habt",
        "examples": [
          {
            "german": "Wir haben Zeit.",
            "vietnamese": "Chúng tôi có thời gian."
          },
          {
            "german": "Ihr habt Glück.",
            "vietnamese": "Các bạn may mắn."
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Ihr ___ eine Frage.",
            "answer": "habt",
            "explanation": "ihr habt.",
            "difficulty": 1,
            "conceptId": "c02"
          }
        ]
      },
      {
        "id": "c03",
        "title": "Các chunk đời thường",
        "explanation": "Tiếng Đức dùng haben trong các cụm mà tiếng Việt thường nói bằng tính từ: Hunger/Durst/Zeit/Glück/eine Frage haben.",
        "pattern": "Hunger haben · Durst haben · Zeit haben",
        "examples": [
          {
            "german": "Ich habe Hunger.",
            "vietnamese": "Tôi đói."
          },
          {
            "german": "Ich habe Durst.",
            "vietnamese": "Tôi khát."
          },
          {
            "german": "Ich habe keine Zeit.",
            "vietnamese": "Tôi không có thời gian."
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Câu đúng để nói “Tôi đói”?",
            "answer": "Ich habe Hunger.",
            "explanation": "Dùng Hunger haben.",
            "difficulty": 1,
            "options": [
              "Ich habe Hunger.",
              "Ich bin Hunger.",
              "Ich mache Hunger.",
              "Ich heiße Hunger."
            ],
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ich ___ Zeit.",
        "answer": "habe",
        "explanation": "ich habe.",
        "difficulty": 1
      },
      {
        "id": "d02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Du ___ Hunger.",
        "answer": "hast",
        "explanation": "du hast.",
        "difficulty": 1
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Er ___ ein Auto.",
        "answer": "hat",
        "explanation": "er hat.",
        "difficulty": 1
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Wir ___ ein Problem.",
        "answer": "haben",
        "explanation": "wir haben.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ihr ___ Glück.",
        "answer": "habt",
        "explanation": "ihr habt.",
        "difficulty": 1
      },
      {
        "id": "d06",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Du habst Zeit.”",
        "answer": "Du hast Zeit",
        "explanation": "du hast.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Du hast Zeit."
        ]
      },
      {
        "id": "d07",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa: “Ich bin Hunger.”",
        "answer": "Ich habe Hunger",
        "explanation": "Hunger haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich habe Hunger."
        ]
      },
      {
        "id": "d08",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi khát.",
        "answer": "Ich habe Durst",
        "explanation": "Durst haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich habe Durst."
        ]
      },
      {
        "id": "d09",
        "kind": "choice",
        "skill": "communication",
        "prompt": "“Ich habe keine Zeit.” nghĩa là?",
        "answer": "Tôi không có thời gian",
        "explanation": "keine Zeit.",
        "difficulty": 1,
        "options": [
          "Tôi không có thời gian",
          "Tôi có rất nhiều thời gian",
          "Tôi đang đói",
          "Tôi mệt"
        ]
      },
      {
        "id": "d10",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: eine / Ich / Frage / habe",
        "answer": "Ich habe eine Frage",
        "explanation": "Verb vị trí 2.",
        "difficulty": 1,
        "words": [
          "Ich",
          "habe",
          "eine",
          "Frage"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Nhu cầu hôm nay",
        "prompt": "Viết 3 câu về bạn với haben: đói/khát/thời gian/câu hỏi.",
        "hint": "Có thể dùng Hunger, Durst, Zeit, eine Frage.",
        "required": [
          "habe"
        ],
        "modelAnswer": "Ich habe Hunger. Ich habe Durst. Ich habe eine Frage."
      },
      {
        "id": "p02",
        "title": "Phủ định",
        "prompt": "Viết: Tôi không có thời gian.",
        "hint": "Dùng keine Zeit.",
        "required": [
          "keine",
          "Zeit"
        ],
        "modelAnswer": "Ich habe keine Zeit."
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich habe Hunger.",
        "meaning": "Tôi đói.",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich habe Durst.",
        "meaning": "Tôi khát.",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich habe eine Frage.",
        "meaning": "Tôi có một câu hỏi.",
        "minSimilarity": 0.65
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Trả lời: “Hast du Zeit?”",
        "target": "Ja, ich habe Zeit.",
        "meaning": "Có, tôi có thời gian.",
        "minSimilarity": 0.35
      }
    ],
    "challenge": {
      "id": "ch07",
      "title": "Ở quán cà phê",
      "context": "Bạn cần diễn đạt nhu cầu cơ bản.",
      "goal": "Dùng haben như các chunk đời thường.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Bạn đang rất khát. Hãy nói một câu.",
          "required": [
            "habe",
            "Durst"
          ],
          "sampleAnswer": "Ich habe Durst.",
          "hint": "Durst haben."
        },
        {
          "id": "t2",
          "prompt": "Bạn muốn nói mình có một câu hỏi.",
          "required": [
            "habe",
            "Frage"
          ],
          "sampleAnswer": "Ich habe eine Frage.",
          "hint": "eine Frage haben."
        },
        {
          "id": "t3",
          "prompt": "Bạn bận. Hãy nói “Tôi không có thời gian.”",
          "required": [
            "keine",
            "Zeit"
          ],
          "sampleAnswer": "Ich habe keine Zeit.",
          "hint": "keine Zeit."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "grammar",
        "prompt": "du + haben = ?",
        "answer": "hast",
        "explanation": "du hast.",
        "difficulty": 1
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "grammar",
        "prompt": "er + haben = ?",
        "answer": "hat",
        "explanation": "er hat.",
        "difficulty": 1
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "grammar",
        "prompt": "ihr + haben = ?",
        "answer": "habt",
        "explanation": "ihr habt.",
        "difficulty": 1
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Sie hat Zeit.” nếu Sie = Ngài.",
        "answer": "Sie haben Zeit",
        "explanation": "Sie lịch sự → haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Sie haben Zeit."
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa: “Ich bin Durst.”",
        "answer": "Ich habe Durst",
        "explanation": "Durst haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich habe Durst."
        ]
      },
      {
        "id": "m06",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Chúng tôi có một vấn đề.",
        "answer": "Wir haben ein Problem",
        "explanation": "wir haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wir haben ein Problem."
        ]
      },
      {
        "id": "m07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: keine / habe / Zeit / Ich",
        "answer": "Ich habe keine Zeit",
        "explanation": "Phủ định noun.",
        "difficulty": 1,
        "words": [
          "Ich",
          "habe",
          "keine",
          "Zeit"
        ]
      },
      {
        "id": "m08",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu nào tự nhiên để nói “Tôi có một câu hỏi”?",
        "answer": "Ich habe eine Frage.",
        "explanation": "Chunk chuẩn.",
        "difficulty": 1,
        "options": [
          "Ich habe eine Frage.",
          "Ich bin eine Frage.",
          "Ich mache eine Frage.",
          "Ich spreche eine Frage."
        ]
      }
    ],
    "remediation": [
      {
        "skill": "grammar",
        "title": "hast và hat",
        "explanation": "du hast; er/sie/es hat.",
        "retry": [
          {
            "id": "r01",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Du ___ Hunger.",
            "answer": "hast",
            "explanation": "du hast.",
            "difficulty": 1
          },
          {
            "id": "r02",
            "kind": "input",
            "skill": "grammar",
            "prompt": "Er ___ Zeit.",
            "answer": "hat",
            "explanation": "er hat.",
            "difficulty": 1
          }
        ]
      },
      {
        "skill": "production",
        "title": "Hunger/Durst haben",
        "explanation": "Không dùng sein với Hunger/Durst.",
        "retry": [
          {
            "id": "r03",
            "kind": "correct",
            "skill": "production",
            "prompt": "Sửa: “Ich bin Hunger.”",
            "answer": "Ich habe Hunger",
            "explanation": "haben.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Ich habe Hunger."
            ]
          },
          {
            "id": "r04",
            "kind": "input",
            "skill": "production",
            "prompt": "Dịch: Tôi khát.",
            "answer": "Ich habe Durst",
            "explanation": "haben.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Ich habe Durst."
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "habe/hast/hat/haben/habt",
        "Hunger/Durst/Zeit/Frage haben"
      ],
      "canDo": [
        "Nói sở hữu cơ bản",
        "Nói nhu cầu đời thường"
      ],
      "commonMistakes": [
        "du habst",
        "Ich bin Hunger",
        "Ich bin Durst"
      ],
      "realGerman": [
        {
          "textbook": "Ich habe großen Hunger.",
          "natural": "Ich habe echt Hunger.",
          "note": "echt Hunger là cách nói thân mật, rất phổ biến."
        }
      ],
      "nextLessonId": "l_a0_08"
    }
  },
  "l_a0_08": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Phân biệt Wer, Was, Wie, Wo, Woher và cấu trúc câu hỏi Có/Không."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Tự viết câu hỏi tên, quê, nơi ở và thông tin cơ bản."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Đặt động từ đúng vị trí: sau W-word hoặc đứng đầu trong câu Ja/Nein."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi tên?",
        "answer": "Wie heißt du?",
        "explanation": "Wie.",
        "difficulty": 1,
        "options": [
          "Wie heißt du?",
          "Wo wohnst du?",
          "Wer bist du?",
          "Was kostet das?"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi quê?",
        "answer": "Woher kommst du?",
        "explanation": "Woher = từ đâu.",
        "difficulty": 1,
        "options": [
          "Woher kommst du?",
          "Wo wohnst du?",
          "Wie heißt du?",
          "Was sprichst du?"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "W-Fragen",
        "explanation": "Từ hỏi đứng đầu, động từ chia đứng ngay sau.",
        "pattern": "W-Wort + Verb + Subjekt + ...?",
        "examples": [
          {
            "german": "Wie heißt du?",
            "vietnamese": "Bạn tên gì?"
          },
          {
            "german": "Wo wohnst du?",
            "vietnamese": "Bạn sống ở đâu?"
          },
          {
            "german": "Woher kommst du?",
            "vietnamese": "Bạn đến từ đâu?"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: du / Wo / wohnst",
            "answer": "Wo wohnst du",
            "explanation": "W + verb + subject.",
            "difficulty": 1,
            "words": [
              "Wo",
              "wohnst",
              "du"
            ],
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "Ja/Nein-Fragen",
        "explanation": "Không có W-word; động từ chia lên đầu câu.",
        "pattern": "Verb + Subjekt + ...?",
        "examples": [
          {
            "german": "Lernst du Deutsch?",
            "vietnamese": "Bạn học tiếng Đức phải không?"
          },
          {
            "german": "Hast du Zeit?",
            "vietnamese": "Bạn có thời gian không?"
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: du / Zeit / Hast",
            "answer": "Hast du Zeit",
            "explanation": "Verb đầu câu.",
            "difficulty": 1,
            "words": [
              "Hast",
              "du",
              "Zeit"
            ],
            "conceptId": "c02"
          }
        ]
      },
      {
        "id": "c03",
        "title": "Wo, Woher, Wohin",
        "explanation": "Wo = ở đâu; Woher = từ đâu; Wohin = đi đâu. Ở A0 chỉ cần phân biệt ý nghĩa.",
        "pattern": "Wo = location · Woher = origin · Wohin = direction",
        "examples": [
          {
            "german": "Wo bist du?",
            "vietnamese": "Bạn ở đâu?"
          },
          {
            "german": "Woher kommst du?",
            "vietnamese": "Bạn đến từ đâu?"
          },
          {
            "german": "Wohin gehst du?",
            "vietnamese": "Bạn đi đâu?"
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Hỏi nguồn gốc dùng từ nào?",
            "answer": "Woher",
            "explanation": "Woher = từ đâu.",
            "difficulty": 1,
            "options": [
              "Woher",
              "Wo",
              "Wohin",
              "Wer"
            ],
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "“Ai?” = ?",
        "answer": "Wer",
        "explanation": "Wer=ai.",
        "difficulty": 1,
        "options": [
          "Wer",
          "Was",
          "Wie",
          "Wo"
        ]
      },
      {
        "id": "d02",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "“Cái gì?” = ?",
        "answer": "Was",
        "explanation": "Was=cái gì.",
        "difficulty": 1,
        "options": [
          "Was",
          "Wer",
          "Wo",
          "Woher"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Hỏi nơi ở: ___ wohnst du?",
        "answer": "Wo",
        "explanation": "Wo = ở đâu.",
        "difficulty": 1
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Hỏi nguồn gốc: ___ kommst du?",
        "answer": "Woher",
        "explanation": "Woher = từ đâu.",
        "difficulty": 1
      },
      {
        "id": "d05",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: heißt / du / Wie",
        "answer": "Wie heißt du",
        "explanation": "W + verb + subject.",
        "difficulty": 1,
        "words": [
          "Wie",
          "heißt",
          "du"
        ]
      },
      {
        "id": "d06",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: du / Deutsch / Lernst",
        "answer": "Lernst du Deutsch",
        "explanation": "Yes/no verb first.",
        "difficulty": 1,
        "words": [
          "Lernst",
          "du",
          "Deutsch"
        ]
      },
      {
        "id": "d07",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Wo du wohnst?”",
        "answer": "Wo wohnst du",
        "explanation": "Verb sau W-word.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wo wohnst du?"
        ]
      },
      {
        "id": "d08",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Du hast Zeit?” thành dạng Ja/Nein chuẩn.",
        "answer": "Hast du Zeit",
        "explanation": "Verb đầu câu.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Hast du Zeit?"
        ]
      },
      {
        "id": "d09",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Bạn đến từ đâu?",
        "answer": "Woher kommst du",
        "explanation": "Woher + kommst + du.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Woher kommst du?"
        ]
      },
      {
        "id": "d10",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Bạn đang hỏi hướng đi: dùng từ nào?",
        "answer": "Wohin",
        "explanation": "Wohin = đi đâu.",
        "difficulty": 1,
        "options": [
          "Wohin",
          "Woher",
          "Wo",
          "Wer"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Ba câu hỏi",
        "prompt": "Viết 3 câu hỏi: tên, quê, nơi ở.",
        "hint": "Dùng Wie / Woher / Wo.",
        "required": [
          "Wie",
          "Woher",
          "Wo"
        ],
        "modelAnswer": "Wie heißt du? Woher kommst du? Wo wohnst du?"
      },
      {
        "id": "p02",
        "title": "Một câu Có/Không",
        "prompt": "Viết một câu hỏi Có/Không với “Deutsch lernen”.",
        "hint": "Động từ phải đứng đầu.",
        "required": [
          "Lernst"
        ],
        "modelAnswer": "Lernst du Deutsch?"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Wie heißt du?",
        "meaning": "Bạn tên gì?",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Woher kommst du?",
        "meaning": "Bạn đến từ đâu?",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Hast du Zeit?",
        "meaning": "Bạn có thời gian không?",
        "minSimilarity": 0.65
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Trả lời: “Wo wohnst du?”",
        "target": "Ich wohne in Hanoi.",
        "meaning": "Tôi sống ở Hà Nội.",
        "minSimilarity": 0.35
      }
    ],
    "challenge": {
      "id": "ch08",
      "title": "Hỏi người mới gặp",
      "context": "Bạn có 30 giây để làm quen một bạn mới.",
      "goal": "Tạo câu hỏi đúng cấu trúc.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Hỏi tên.",
          "required": [
            "Wie",
            "heißt"
          ],
          "sampleAnswer": "Wie heißt du?",
          "hint": "Wie + verb."
        },
        {
          "id": "t2",
          "prompt": "Hỏi quê.",
          "required": [
            "Woher",
            "kommst"
          ],
          "sampleAnswer": "Woher kommst du?",
          "hint": "Woher."
        },
        {
          "id": "t3",
          "prompt": "Hỏi nơi ở.",
          "required": [
            "Wo",
            "wohnst"
          ],
          "sampleAnswer": "Wo wohnst du?",
          "hint": "Wo."
        },
        {
          "id": "t4",
          "prompt": "Hỏi họ có học tiếng Đức không.",
          "required": [
            "Lernst"
          ],
          "sampleAnswer": "Lernst du Deutsch?",
          "hint": "Verb đầu câu."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Woher nghĩa là?",
        "answer": "từ đâu",
        "explanation": "Origin.",
        "difficulty": 1,
        "options": [
          "từ đâu",
          "ở đâu",
          "đi đâu",
          "ai"
        ]
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Bạn sống ở đâu?",
        "answer": "Wo wohnst du",
        "explanation": "W + verb.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wo wohnst du?"
        ]
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Bạn học tiếng Đức phải không?",
        "answer": "Lernst du Deutsch",
        "explanation": "Yes/no.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Lernst du Deutsch?"
        ]
      },
      {
        "id": "m04",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Wie du heißt?”",
        "answer": "Wie heißt du",
        "explanation": "W + verb + subject.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wie heißt du?"
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Du hast Hunger?”",
        "answer": "Hast du Hunger",
        "explanation": "Verb first.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Hast du Hunger?"
        ]
      },
      {
        "id": "m06",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: kommst / Woher / du",
        "answer": "Woher kommst du",
        "explanation": "W + verb + subject.",
        "difficulty": 1,
        "words": [
          "Woher",
          "kommst",
          "du"
        ]
      },
      {
        "id": "m07",
        "kind": "choice",
        "skill": "grammar",
        "prompt": "Hỏi “đi đâu” dùng?",
        "answer": "Wohin",
        "explanation": "Direction.",
        "difficulty": 1,
        "options": [
          "Wohin",
          "Wo",
          "Woher",
          "Wer"
        ]
      },
      {
        "id": "m08",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết câu hỏi “Ai là đó?”",
        "answer": "Wer ist das",
        "explanation": "Wer ist das?",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wer ist das?"
        ]
      }
    ],
    "remediation": [
      {
        "skill": "word_order",
        "title": "Vị trí động từ trong câu hỏi",
        "explanation": "W-question: W + Verb + Subject. Yes/no: Verb + Subject.",
        "retry": [
          {
            "id": "r01",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: Wo / du / wohnst",
            "answer": "Wo wohnst du",
            "explanation": "W + verb.",
            "difficulty": 1,
            "words": [
              "Wo",
              "wohnst",
              "du"
            ]
          },
          {
            "id": "r02",
            "kind": "reorder",
            "skill": "word_order",
            "prompt": "Sắp xếp: du / Zeit / Hast",
            "answer": "Hast du Zeit",
            "explanation": "Verb first.",
            "difficulty": 1,
            "words": [
              "Hast",
              "du",
              "Zeit"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "Wer/Was/Wie/Wo/Woher/Wohin",
        "W + Verb + Subject",
        "Verb + Subject cho Ja/Nein"
      ],
      "canDo": [
        "Hỏi tên/quê/nơi ở",
        "Tạo câu hỏi Có/Không"
      ],
      "commonMistakes": [
        "Wo du wohnst",
        "Du hast Zeit? khi cần cấu trúc chuẩn"
      ],
      "realGerman": [
        {
          "textbook": "Wie heißt du?",
          "natural": "Wie heißt du?",
          "note": "Đây đã là câu tự nhiên. Trong lời nói, ngữ điệu giúp câu hỏi rõ hơn."
        }
      ],
      "nextLessonId": "l_a0_09"
    }
  },
  "l_a0_09": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Gắn danh từ cơ bản với der/die/das và biết plural Nominativ dùng die."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Nhập article + noun thay vì chỉ nhận ra qua màu."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Không học noun tách khỏi article và không coi mọi mẹo hậu tố là luật tuyệt đối."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "article",
        "prompt": "Haus đi với article nào?",
        "answer": "das",
        "explanation": "das Haus.",
        "difficulty": 1,
        "options": [
          "das",
          "der",
          "die"
        ]
      },
      {
        "id": "w02",
        "kind": "choice",
        "skill": "article",
        "prompt": "Frau đi với article nào?",
        "answer": "die",
        "explanation": "die Frau.",
        "difficulty": 1,
        "options": [
          "die",
          "der",
          "das"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Học noun như một cụm",
        "explanation": "Không học “Tisch”; học “der Tisch”. Article là một phần của từ vựng.",
        "pattern": "article + Noun",
        "examples": [
          {
            "german": "der Tisch",
            "vietnamese": "cái bàn"
          },
          {
            "german": "die Frau",
            "vietnamese": "người phụ nữ"
          },
          {
            "german": "das Haus",
            "vietnamese": "ngôi nhà"
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "input",
            "skill": "article",
            "prompt": "Gõ cả cụm: ___ Haus",
            "answer": "das Haus",
            "explanation": "Học cả article+noun.",
            "difficulty": 1,
            "acceptedAnswers": [
              "das haus"
            ],
            "conceptId": "c01"
          }
        ]
      },
      {
        "id": "c02",
        "title": "Plural Nominativ",
        "explanation": "Ở dạng số nhiều Nominativ, article xác định là die.",
        "pattern": "Singular der/die/das → Plural die",
        "examples": [
          {
            "german": "das Haus → die Häuser",
            "vietnamese": "ngôi nhà → các ngôi nhà"
          },
          {
            "german": "der Tisch → die Tische",
            "vietnamese": "cái bàn → các cái bàn"
          }
        ],
        "checkpoint": [
          {
            "id": "c02q",
            "kind": "choice",
            "skill": "article",
            "prompt": "Plural của Haus dùng article xác định nào?",
            "answer": "die",
            "explanation": "Plural Nominativ dùng die.",
            "difficulty": 1,
            "options": [
              "die",
              "der",
              "das",
              "den"
            ],
            "conceptId": "c02"
          }
        ]
      },
      {
        "id": "c03",
        "title": "Mẹo hậu tố có độ tin cậy cao",
        "explanation": "Một số hậu tố là tín hiệu rất mạnh: -ung/-heit/-keit thường die; -chen/-lein luôn das. Hãy dùng mẹo để hỗ trợ, không thay thế việc học cả từ.",
        "pattern": "-ung → die · -chen → das",
        "examples": [
          {
            "german": "die Wohnung",
            "vietnamese": "căn hộ"
          },
          {
            "german": "das Mädchen",
            "vietnamese": "cô gái"
          }
        ],
        "checkpoint": [
          {
            "id": "c03q",
            "kind": "choice",
            "skill": "article",
            "prompt": "“Mädchen” có -chen, article nào?",
            "answer": "das",
            "explanation": "-chen → das.",
            "difficulty": 1,
            "options": [
              "das",
              "die",
              "der"
            ],
            "conceptId": "c03"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Tisch",
        "answer": "der Tisch",
        "explanation": "der Tisch.",
        "difficulty": 1,
        "acceptedAnswers": [
          "der"
        ]
      },
      {
        "id": "d02",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Frau",
        "answer": "die Frau",
        "explanation": "die Frau.",
        "difficulty": 1,
        "acceptedAnswers": [
          "die"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Haus",
        "answer": "das Haus",
        "explanation": "das Haus.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das"
        ]
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Buch",
        "answer": "das Buch",
        "explanation": "das Buch.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das"
        ]
      },
      {
        "id": "d05",
        "kind": "choice",
        "skill": "article",
        "prompt": "Plural xác định của “Haus” dùng?",
        "answer": "die",
        "explanation": "Plural Nominativ die.",
        "difficulty": 1,
        "options": [
          "die",
          "der",
          "das",
          "den"
        ]
      },
      {
        "id": "d06",
        "kind": "choice",
        "skill": "article",
        "prompt": "Từ tận cùng -ung thường thuộc nhóm nào?",
        "answer": "die",
        "explanation": "-ung thường die.",
        "difficulty": 1,
        "options": [
          "die",
          "der",
          "das"
        ]
      },
      {
        "id": "d07",
        "kind": "choice",
        "skill": "article",
        "prompt": "Từ tận cùng -chen dùng article nào?",
        "answer": "das",
        "explanation": "-chen → das.",
        "difficulty": 1,
        "options": [
          "das",
          "die",
          "der"
        ]
      },
      {
        "id": "d08",
        "kind": "correct",
        "skill": "article",
        "prompt": "Sửa: “die Haus”",
        "answer": "das Haus",
        "explanation": "Haus là das.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das Haus"
        ]
      },
      {
        "id": "d09",
        "kind": "correct",
        "skill": "article",
        "prompt": "Sửa: “der Frau” ở dạng từ vựng cơ bản Nominativ.",
        "answer": "die Frau",
        "explanation": "Frau là die.",
        "difficulty": 1,
        "acceptedAnswers": [
          "die Frau"
        ]
      },
      {
        "id": "d10",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết cả cụm “cái bàn” bằng tiếng Đức.",
        "answer": "der Tisch",
        "explanation": "Học cả article.",
        "difficulty": 1,
        "acceptedAnswers": [
          "der tisch"
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "Ba danh từ có article",
        "prompt": "Viết 3 cụm: cái bàn, người phụ nữ, ngôi nhà.",
        "hint": "Dùng article trước mỗi noun.",
        "required": [
          "der Tisch",
          "die Frau",
          "das Haus"
        ],
        "modelAnswer": "der Tisch, die Frau, das Haus"
      },
      {
        "id": "p02",
        "title": "Một singular → plural",
        "prompt": "Viết: das Haus → ... Häuser",
        "hint": "Plural xác định dùng die.",
        "required": [
          "die"
        ],
        "modelAnswer": "das Haus → die Häuser"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Đọc cả cụm.",
        "target": "der Tisch",
        "meaning": "cái bàn",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Đọc cả cụm.",
        "target": "die Frau",
        "meaning": "người phụ nữ",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "shadow",
        "prompt": "Đọc cả cụm.",
        "target": "das Haus",
        "meaning": "ngôi nhà",
        "minSimilarity": 0.65
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Đọc plural.",
        "target": "die Häuser",
        "meaning": "những ngôi nhà",
        "minSimilarity": 0.35
      }
    ],
    "challenge": {
      "id": "ch09",
      "title": "Nhìn đồ vật trong phòng",
      "context": "Bạn ghi nhãn đồ vật để nhớ article.",
      "goal": "Luôn nói article cùng noun.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Bạn thấy một cái bàn. Viết cả cụm.",
          "required": [
            "der",
            "Tisch"
          ],
          "sampleAnswer": "der Tisch",
          "hint": "Article+noun."
        },
        {
          "id": "t2",
          "prompt": "Bạn thấy một cuốn sách. Viết cả cụm.",
          "required": [
            "das",
            "Buch"
          ],
          "sampleAnswer": "das Buch",
          "hint": "Article+noun."
        },
        {
          "id": "t3",
          "prompt": "Bạn thấy nhiều ngôi nhà. Viết article plural + noun.",
          "required": [
            "die",
            "Häuser"
          ],
          "sampleAnswer": "die Häuser",
          "hint": "Plural die."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Mann",
        "answer": "der Mann",
        "explanation": "der Mann.",
        "difficulty": 1,
        "acceptedAnswers": [
          "der"
        ]
      },
      {
        "id": "m02",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Frau",
        "answer": "die Frau",
        "explanation": "die Frau.",
        "difficulty": 1,
        "acceptedAnswers": [
          "die"
        ]
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Haus",
        "answer": "das Haus",
        "explanation": "das Haus.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das"
        ]
      },
      {
        "id": "m04",
        "kind": "choice",
        "skill": "article",
        "prompt": "Plural xác định dùng article nào?",
        "answer": "die",
        "explanation": "Plural Nominativ.",
        "difficulty": 1,
        "options": [
          "die",
          "der",
          "das",
          "ein"
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "article",
        "prompt": "Sửa: “die Buch”",
        "answer": "das Buch",
        "explanation": "Buch là das.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das Buch"
        ]
      },
      {
        "id": "m06",
        "kind": "choice",
        "skill": "article",
        "prompt": "“Wohnung” thường đi với?",
        "answer": "die",
        "explanation": "-ung thường die.",
        "difficulty": 1,
        "options": [
          "die",
          "der",
          "das"
        ]
      },
      {
        "id": "m07",
        "kind": "choice",
        "skill": "article",
        "prompt": "“Mädchen” đi với?",
        "answer": "das",
        "explanation": "-chen -> das.",
        "difficulty": 1,
        "options": [
          "das",
          "die",
          "der"
        ]
      },
      {
        "id": "m08",
        "kind": "input",
        "skill": "production",
        "prompt": "Viết cả cụm “cái bàn”.",
        "answer": "der Tisch",
        "explanation": "Article+noun.",
        "difficulty": 1,
        "acceptedAnswers": [
          "der tisch"
        ]
      }
    ],
    "remediation": [
      {
        "skill": "article",
        "title": "Học cả article+noun",
        "explanation": "Đừng nhớ noun một mình. Hãy đọc cả cụm như một đơn vị.",
        "retry": [
          {
            "id": "r01",
            "kind": "input",
            "skill": "article",
            "prompt": "___ Haus",
            "answer": "das Haus",
            "explanation": "das Haus.",
            "difficulty": 1,
            "acceptedAnswers": [
              "das"
            ]
          },
          {
            "id": "r02",
            "kind": "input",
            "skill": "article",
            "prompt": "___ Tisch",
            "answer": "der Tisch",
            "explanation": "der Tisch.",
            "difficulty": 1,
            "acceptedAnswers": [
              "der"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "der/die/das là một phần của noun",
        "plural Nominativ dùng die",
        "-ung và -chen là tín hiệu hữu ích"
      ],
      "canDo": [
        "Nhớ article cùng noun",
        "Tạo cụm article+noun"
      ],
      "commonMistakes": [
        "Học Haus mà không học das",
        "Đoán article bằng màu nhưng không nhớ từ"
      ],
      "realGerman": [
        {
          "textbook": "das Haus",
          "natural": "das Haus",
          "note": "Article là kiến thức thật, không phải phần trang trí; hãy luôn đọc cả cụm."
        }
      ],
      "nextLessonId": "l_a0_10"
    }
  },
  "l_a0_10": {
    "version": 2,
    "objectives": [
      {
        "id": "o1",
        "kind": "knowledge",
        "text": "Ôn tổng hợp phát âm, từ vựng, ngữ pháp và cấu trúc A0."
      },
      {
        "id": "o2",
        "kind": "production",
        "text": "Tạo được một đoạn giới thiệu cơ bản và phản hồi tình huống đời thường."
      },
      {
        "id": "o3",
        "kind": "error_avoidance",
        "text": "Phát hiện các lỗi A0 phổ biến trước khi chuyển sang A1."
      }
    ],
    "warmup": [
      {
        "id": "w01",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Bạn đã sẵn sàng? Chọn câu đúng.",
        "answer": "Ich bin bereit!",
        "explanation": "sein + bereit.",
        "difficulty": 1,
        "options": [
          "Ich bin bereit!",
          "Ich habe bereit!",
          "Ich bereit bin!",
          "Ich heiße bereit!"
        ]
      }
    ],
    "concepts": [
      {
        "id": "c01",
        "title": "Bản đồ A0",
        "explanation": "A0 kết nối 5 cụm năng lực: phát âm, chào hỏi, giới thiệu, số, động từ/câu hỏi/article.",
        "pattern": "Không học mảnh rời; hãy dùng chúng cùng nhau.",
        "examples": [
          {
            "german": "Hallo! Ich heiße Minh und komme aus Vietnam.",
            "vietnamese": "Chào! Tôi tên Minh và đến từ Việt Nam."
          },
          {
            "german": "Ich bin 25 Jahre alt und lerne Deutsch.",
            "vietnamese": "Tôi 25 tuổi và học tiếng Đức."
          }
        ],
        "checkpoint": [
          {
            "id": "c01q",
            "kind": "choice",
            "skill": "communication",
            "prompt": "Câu giới thiệu nào đúng?",
            "answer": "Hallo! Ich heiße Minh und komme aus Vietnam.",
            "explanation": "Tổng hợp A0.",
            "difficulty": 1,
            "options": [
              "Hallo! Ich heiße Minh und komme aus Vietnam.",
              "Hallo! Ich heißen Minh.",
              "Ich kommen aus Vietnam.",
              "Ich habe 25 Jahre alt."
            ],
            "conceptId": "c01"
          }
        ]
      }
    ],
    "drills": [
      {
        "id": "d01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "ei đọc gần?",
        "answer": "ai",
        "explanation": "ei→ai.",
        "difficulty": 1,
        "options": [
          "ai",
          "i dài",
          "oi",
          "u"
        ]
      },
      {
        "id": "d02",
        "kind": "choice",
        "skill": "communication",
        "prompt": "08:00 gặp giáo viên.",
        "answer": "Guten Morgen!",
        "explanation": "Greeting.",
        "difficulty": 1,
        "options": [
          "Guten Morgen!",
          "Gute Nacht!",
          "Tschüss!",
          "Auf Wiedersehen!"
        ]
      },
      {
        "id": "d03",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi tên Nam.",
        "answer": "Ich heiße Nam",
        "explanation": "heißen.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich heiße Nam.",
          "Ich heisse Nam",
          "Ich heisse Nam."
        ]
      },
      {
        "id": "d04",
        "kind": "input",
        "skill": "production",
        "prompt": "34 = ?",
        "answer": "vierunddreißig",
        "explanation": "number.",
        "difficulty": 1,
        "acceptedAnswers": [
          "vierunddreissig"
        ]
      },
      {
        "id": "d05",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Ihr ___ nett. (sein)",
        "answer": "seid",
        "explanation": "ihr seid.",
        "difficulty": 1
      },
      {
        "id": "d06",
        "kind": "input",
        "skill": "grammar",
        "prompt": "Du ___ Hunger. (haben)",
        "answer": "hast",
        "explanation": "du hast.",
        "difficulty": 1
      },
      {
        "id": "d07",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: Wo / du / wohnst",
        "answer": "Wo wohnst du",
        "explanation": "W question.",
        "difficulty": 1,
        "words": [
          "Wo",
          "wohnst",
          "du"
        ]
      },
      {
        "id": "d08",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Haus",
        "answer": "das Haus",
        "explanation": "article.",
        "difficulty": 1,
        "acceptedAnswers": [
          "das"
        ]
      },
      {
        "id": "d09",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ich habe 24 Jahre alt.”",
        "answer": "Ich bin 24 Jahre alt",
        "explanation": "Age uses sein.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich bin 24 Jahre alt."
        ]
      },
      {
        "id": "d10",
        "kind": "correct",
        "skill": "word_order",
        "prompt": "Sửa: “Heute ich lerne Deutsch.”",
        "answer": "Heute lerne ich Deutsch",
        "explanation": "Verb position 2.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Heute lerne ich Deutsch."
        ]
      }
    ],
    "production": [
      {
        "id": "p01",
        "title": "A0 profile",
        "prompt": "Viết 4 câu: tên, quê, nơi ở, tuổi/ngôn ngữ.",
        "hint": "Dùng ít nhất 3 mẫu đã học.",
        "required": [
          "Ich",
          "komme",
          "wohne"
        ],
        "modelAnswer": "Hallo! Ich heiße Minh. Ich komme aus Vietnam. Ich wohne in Hanoi. Ich bin 25 Jahre alt und lerne Deutsch."
      },
      {
        "id": "p02",
        "title": "Một câu hỏi",
        "prompt": "Viết một câu hỏi phù hợp để làm quen người mới.",
        "hint": "Ví dụ hỏi tên/quê/nơi ở.",
        "required": [
          "?"
        ],
        "modelAnswer": "Wie heißt du?"
      }
    ],
    "speaking": [
      {
        "id": "s01",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Hallo! Ich heiße Minh.",
        "meaning": "Chào! Tôi tên Minh.",
        "minSimilarity": 0.65
      },
      {
        "id": "s02",
        "mode": "shadow",
        "prompt": "Nhại lại.",
        "target": "Ich komme aus Vietnam und wohne in Hanoi.",
        "meaning": "Tôi đến từ Việt Nam và sống ở Hà Nội.",
        "minSimilarity": 0.65
      },
      {
        "id": "s03",
        "mode": "respond",
        "prompt": "Trả lời: “Wie heißt du?”",
        "target": "Ich heiße Minh.",
        "meaning": "Tôi tên Minh.",
        "minSimilarity": 0.35
      },
      {
        "id": "s04",
        "mode": "respond",
        "prompt": "Trả lời: “Woher kommst du?”",
        "target": "Ich komme aus Vietnam.",
        "meaning": "Tôi đến từ Việt Nam.",
        "minSimilarity": 0.35
      }
    ],
    "challenge": {
      "id": "ch10",
      "title": "Ngày đầu ở lớp A1",
      "context": "Giáo viên A1 hỏi vài câu để kiểm tra nền tảng.",
      "goal": "Kết hợp nhiều kỹ năng A0.",
      "turns": [
        {
          "id": "t1",
          "prompt": "Begrüßen Sie mich. (Hãy chào tôi một cách lịch sự.)",
          "required": [
            "Guten"
          ],
          "sampleAnswer": "Guten Tag!",
          "hint": "Formal greeting."
        },
        {
          "id": "t2",
          "prompt": "Wie heißen Sie?",
          "required": [
            "heiße"
          ],
          "sampleAnswer": "Ich heiße Minh.",
          "hint": "Tên."
        },
        {
          "id": "t3",
          "prompt": "Woher kommen Sie?",
          "required": [
            "komme",
            "aus"
          ],
          "sampleAnswer": "Ich komme aus Vietnam.",
          "hint": "Quê."
        },
        {
          "id": "t4",
          "prompt": "Sprechen Sie Deutsch?",
          "required": [
            "spreche",
            "Deutsch"
          ],
          "sampleAnswer": "Ja, ich spreche ein bisschen Deutsch.",
          "hint": "Ngôn ngữ."
        }
      ]
    },
    "mastery": [
      {
        "id": "m01",
        "kind": "choice",
        "skill": "pronunciation",
        "prompt": "ie đọc gần?",
        "answer": "i dài",
        "explanation": "ie→i dài.",
        "difficulty": 1,
        "options": [
          "i dài",
          "ai",
          "oi",
          "e"
        ]
      },
      {
        "id": "m02",
        "kind": "choice",
        "skill": "communication",
        "prompt": "21:00 đến nhà hàng.",
        "answer": "Guten Abend!",
        "explanation": "Greeting.",
        "difficulty": 1,
        "options": [
          "Guten Abend!",
          "Gute Nacht!",
          "Guten Morgen!",
          "Tschüss!"
        ]
      },
      {
        "id": "m03",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi đến từ Việt Nam.",
        "answer": "Ich komme aus Vietnam",
        "explanation": "kommen aus.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich komme aus Vietnam."
        ]
      },
      {
        "id": "m04",
        "kind": "input",
        "skill": "production",
        "prompt": "52 = ?",
        "answer": "zweiundfünfzig",
        "explanation": "2+50.",
        "difficulty": 1,
        "acceptedAnswers": [
          "zweiundfuenfzig"
        ]
      },
      {
        "id": "m05",
        "kind": "correct",
        "skill": "grammar",
        "prompt": "Sửa: “Ihr sind hier.”",
        "answer": "Ihr seid hier",
        "explanation": "ihr seid.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ihr seid hier."
        ]
      },
      {
        "id": "m06",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa: “Ich bin Hunger.”",
        "answer": "Ich habe Hunger",
        "explanation": "Hunger haben.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich habe Hunger."
        ]
      },
      {
        "id": "m07",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Bạn sống ở đâu?",
        "answer": "Wo wohnst du",
        "explanation": "W-question.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Wo wohnst du?"
        ]
      },
      {
        "id": "m08",
        "kind": "input",
        "skill": "article",
        "prompt": "___ Tisch",
        "answer": "der Tisch",
        "explanation": "der Tisch.",
        "difficulty": 1,
        "acceptedAnswers": [
          "der"
        ]
      },
      {
        "id": "m09",
        "kind": "reorder",
        "skill": "word_order",
        "prompt": "Sắp xếp: Heute / Deutsch / ich / lerne",
        "answer": "Heute lerne ich Deutsch",
        "explanation": "Verb pos 2.",
        "difficulty": 1,
        "words": [
          "Heute",
          "lerne",
          "ich",
          "Deutsch"
        ]
      },
      {
        "id": "m10",
        "kind": "input",
        "skill": "production",
        "prompt": "Dịch: Tôi 25 tuổi.",
        "answer": "Ich bin 25 Jahre alt",
        "explanation": "Age with sein.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich bin 25 Jahre alt."
        ]
      },
      {
        "id": "m11",
        "kind": "choice",
        "skill": "communication",
        "prompt": "Câu hỏi quê đúng?",
        "answer": "Woher kommst du?",
        "explanation": "Woher.",
        "difficulty": 1,
        "options": [
          "Woher kommst du?",
          "Wo wohnst du?",
          "Wie heißt du?",
          "Was kostet das?"
        ]
      },
      {
        "id": "m12",
        "kind": "correct",
        "skill": "production",
        "prompt": "Sửa: “Ich spreche Vietnamesisch và Deutsch.”",
        "answer": "Ich spreche Vietnamesisch und Deutsch",
        "explanation": "und.",
        "difficulty": 1,
        "acceptedAnswers": [
          "Ich spreche Vietnamesisch und Deutsch."
        ]
      }
    ],
    "remediation": [
      {
        "skill": "grammar",
        "title": "sein / haben",
        "explanation": "Tuổi/trạng thái dùng sein; sở hữu/Hunger/Durst dùng haben.",
        "retry": [
          {
            "id": "r01",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Tôi 20 tuổi.",
            "answer": "Ich bin 20 Jahre alt.",
            "explanation": "sein.",
            "difficulty": 1,
            "options": [
              "Ich bin 20 Jahre alt.",
              "Ich habe 20 Jahre alt."
            ]
          },
          {
            "id": "r02",
            "kind": "choice",
            "skill": "grammar",
            "prompt": "Tôi đói.",
            "answer": "Ich habe Hunger.",
            "explanation": "haben.",
            "difficulty": 1,
            "options": [
              "Ich habe Hunger.",
              "Ich bin Hunger."
            ]
          }
        ]
      },
      {
        "skill": "word_order",
        "title": "Verb position",
        "explanation": "Trần thuật: verb vị trí 2. W-question: W + verb + subject.",
        "retry": [
          {
            "id": "r03",
            "kind": "correct",
            "skill": "word_order",
            "prompt": "Sửa: Heute ich lerne Deutsch.",
            "answer": "Heute lerne ich Deutsch",
            "explanation": "Verb thứ 2.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Heute lerne ich Deutsch."
            ]
          },
          {
            "id": "r04",
            "kind": "correct",
            "skill": "word_order",
            "prompt": "Sửa: Wo du wohnst?",
            "answer": "Wo wohnst du",
            "explanation": "W+verb.",
            "difficulty": 1,
            "acceptedAnswers": [
              "Wo wohnst du?"
            ]
          }
        ]
      }
    ],
    "recap": {
      "learned": [
        "Phát âm A0",
        "Chào hỏi",
        "Giới thiệu",
        "Số 0–100",
        "sein/haben",
        "Câu hỏi",
        "der/die/das"
      ],
      "canDo": [
        "Giới thiệu bản thân",
        "Hỏi/đáp thông tin cơ bản",
        "Xử lý số và lời chào đời thường"
      ],
      "commonMistakes": [
        "Verb sai vị trí",
        "sein/haben lẫn nhau",
        "Article tách khỏi noun"
      ],
      "realGerman": [
        {
          "textbook": "Ich spreche ein bisschen Deutsch.",
          "natural": "Ich spreche schon ein bisschen Deutsch.",
          "note": "“schon ein bisschen” nghe tự nhiên khi nói mình đã biết một chút."
        }
      ]
    }
  }
};

export const getDeepA0Lesson = (lessonId: string): DeepLesson | undefined => DEEP_A0_LESSONS[lessonId];
