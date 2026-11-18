# 추천템 모음 (pick)

`@pka0027` 추천템을 모아 두는 모바일용 정적 페이지. GitHub Pages로 서비스한다.

- 페이지: https://somun09.github.io/pick/
- 채널: X [@pka0027](https://x.com/pka0027) · 네이버 블로그 [부산스러운하루](https://blog.naver.com/minchansalad)

## 구조

```
index.html   화면 골격(헤더·필터·검색·카드 목록·고정 고지문)
style.css    모바일 우선 스타일(390px 기준, 다크 모드 대응)
app.js       items.json 을 읽어 카드·카테고리 칩을 그림
items.json   ★ 아이템 데이터 — 이 파일만 고치면 페이지가 갱신된다
assets/      카드 썸네일 이미지
```

## 아이템 추가 방법 (정기 포스팅용)

`items.json` 배열 끝에 객체 하나를 추가하고 커밋·푸시하면 된다.

```json
  {
    "id": "hanil-electric-mat-hl-d205",
    "date": "2026-11-19",
    "categoryKey": "winter",
    "categoryLabel": "겨울·난방",
    "title": "상품명",
    "summary": "한 줄 요약 · 특징 · 평점",
    "price": "29,900원",
    "priceNote": "와우 25,900원 · 11/18 기준",
    "ctaLabel": "쿠팡에서 보기",
    "link": "https://link.coupang.com/a/XXXX",
    "image": "assets/파일명.jpg",
    "imageAlt": "이미지 설명",
    "imageNote": "연출 이미지"
  }
```

- `date` 최신순으로 자동 정렬된다. `$date + 1개월` 같은 표기는 쓰지 않고 `YYYY-MM-DD`로 적는다.
- `categoryKey`는 `winter`(겨울·난방), `life`(생활꿀팁) 중 하나. 새 키를 쓰면 필터 칩이 자동으로 늘어난다.
- `image`는 생략 가능(이미지 없이 카드가 그려진다). 넣을 때는 가로 900px·JPEG 60~90KB 정도로 줄여 `assets/`에 둔다.
- `link`는 쿠팡파트너스 단축 링크. 카드 버튼은 `rel="sponsored noopener noreferrer"` + 새 탭으로 열린다.
- 평점·리뷰 수·가격은 **확인한 값만** 적는다. 체험담처럼 보이는 문장은 쓰지 않는다.

푸시 후 GitHub Pages가 1~2분 안에 자동 재배포한다. (페이지는 `items.json`을 캐시 없이 `?v=타임스탬프`로 불러온다.)

## 고지

이 페이지의 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. (화면 하단 고정)

카드 이미지 중 `imageNote: "연출 이미지"`가 붙은 컷은 분위기용으로 만든 이미지이며 실제 상품 사진이 아니다.
