# 추천템 & 동네 정보 (pick)

`@pka0027` 의 링크 허브. 쿠팡 파트너스 추천템(겨울·자취템)과 재송동 생활정보·상담 링크(당근 비즈프로필, 상담 신청서), 블로그·X 채널을 한 화면에 모은 모바일 우선 정적 페이지. GitHub Pages로 서비스한다.

- 페이지: https://somun09.github.io/Pickles/
- 채널: X [@pka0027](https://x.com/pka0027) · 네이버 블로그 [부산스러운하루](https://blog.naver.com/minchansalad) · 당근 [온라인 마케터 생활정보(재송동)](https://www.daangn.com/kr/local-profile/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EB%A7%88%EC%BC%80%ED%84%B0-%EC%83%9D%ED%99%9C%EC%A0%95%EB%B3%B4-w1e58ifivdph/)

## 구조

```
index.html   화면 골격(헤더·필터·검색·카드 목록·고정 고지문)
style.css    모바일 우선 스타일(390px 기준, 다크 모드 대응)
app.js       items.json 을 읽어 카드·카테고리 칩을 그림
items.json   ★ 데이터 — 이 파일만 고치면 페이지가 갱신된다
assets/      카드 썸네일 이미지
```

## 카테고리

`전체` · `겨울·자취템`(winter) · `생활정보·상담`(life) · `채널`(channel)

- 칩은 데이터에 실제로 있는 카테고리만 그려지고, 개수가 함께 표시된다.
- 새 `categoryKey`를 쓰면 칩이 자동으로 늘어난다.
- `index.html#life` 처럼 해시로 특정 카테고리를 바로 열 수 있다.

## 항목 추가 방법

`items.json` 의 `items` 배열에 객체 하나를 추가하고 커밋·푸시하면 된다.

### 쿠팡 추천템 (type: "product")

```json
  {
    "id": "comet-urethane-weatherstrip-3m",
    "type": "product",
    "active": true,
    "order": 1,
    "date": "2026-11-20",
    "categoryKey": "winter",
    "categoryLabel": "겨울·자취템",
    "tag": "쿠팡 파트너스",
    "title": "상품명",
    "summary": "한 줄 요약 · 상품평 수 · 구매 수",
    "price": "6,010원",
    "priceNote": "1개당 1,202원 · 11/21 기준",
    "ctaLabel": "쿠팡에서 보기",
    "link": "https://link.coupang.com/a/XXXX",
    "image": "assets/파일명.jpg",
    "imageAlt": "이미지 설명",
    "imageNote": "연출 이미지"
  }
```

### 링크 카드 (type: "link" — 당근·상담·채널)

```json
  {
    "id": "daangn-life-info",
    "type": "link",
    "active": true,
    "order": 3,
    "date": "2026-11-20",
    "categoryKey": "life",
    "categoryLabel": "생활정보·상담",
    "tag": "당근",
    "icon": "🥕",
    "title": "카드 제목",
    "summary": "한 줄 설명",
    "ctaLabel": "당근에서 보기",
    "link": "https://..."
  }
```

### 규칙

- `date` 최신순으로 정렬되고, 같은 날짜면 `order` 오름차순. `$date + 1개월` 같은 표기 대신 `YYYY-MM-DD`로 적는다.
- `image` 는 생략 가능(이미지 없는 카드). 넣을 때는 가로 900px·JPEG 60~90KB로 줄여 `assets/`에 둔다.
- 상품 카드의 링크 버튼은 `rel="sponsored noopener noreferrer"` + 새 탭. 링크 카드는 `rel="noopener noreferrer"`.
- 평점·리뷰 수·가격은 **확인한 값만** 적고, 확인 날짜를 `priceNote`에 남긴다. 체험담처럼 보이는 문장은 쓰지 않는다.
- `imageNote: "연출 이미지"` 가 붙은 컷은 분위기용으로 만든 이미지이며 실제 상품 사진이 아니다(푸터에도 같은 안내가 있다).

## 검수 전 광고 링크 다루기 (`active`)

디비센스 CPA 캠페인 링크처럼 **소재 사전검수 승인 전에는 노출하면 안 되는** 링크는 `items.json`에 그대로 두고 `"active": false` 로 저장한다. `app.js`가 `active: false` 항목을 아예 그리지 않으므로 페이지·검색·칩 개수에 나타나지 않는다.

승인 회신이 오면 해당 항목의 `"active": false` 를 `true` 로 바꾸고, `hideReason` 을 지운 뒤 커밋·푸시하면 된다.

현재 `active: false` 로 대기 중인 항목(2026-11-21 기준, 디비센스 `info@d-jlab.com` 검수 대기):

| id | 캠페인 | 링크 |
|---|---|---|
| cpa-moving-seo-kyeongseok | 서경석의 이사방 | https://u3s6dhxdwi.sens.kr |
| cpa-chimhyanghwan-premium-2 | 광동 침향환 프리미엄 II | https://gr2zwc4h59.sens.kr |
| cpa-coway-purifier-rental | 코웨이 정수기 렌탈 | https://y184xqwc0z.sens.kr |
| cpa-home-internet | 우리들이 사용하는 인터넷 | https://fg26t6kd3c.sens.kr |

## 배포

- 사이트: https://somun09.github.io/Pickles/ (GitHub Pages, HTTPS 강제, 소스 `gh-pages` / `/`)
- 작업 브랜치는 `main`, 배포 브랜치는 `gh-pages`. 2026-11-21 최초 배포 때 Pages 생성 API는 Pickle의 GitHub 연동 권한에 `pages=write` 가 없어 403이 났고, `gh-pages` 브랜치를 푸시하자 GitHub이 Pages를 자동 활성화해 배포됐다.

일상 갱신:

```bash
cd /workspace/github-pick
git add -A && git commit -m "아이템 추가"
git push origin main           # 작업 브랜치
git push origin main:gh-pages  # 배포 브랜치 동기화
```

푸시 후 Pages가 1~2분 안에 자동 재배포한다(페이지는 `items.json` 을 `?v=타임스탬프`로 캐시 없이 불러온다). Settings → Pages 의 소스를 `main` / (root) 로 바꾸면 마지막 줄은 필요 없다.

## 고지

이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. (화면 하단 고정)
