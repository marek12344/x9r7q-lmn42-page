# WROTMET - Poradnik wdrożenia strony WWW

Witaj! Zgodnie z poleceniem, cały kod został napisany z myślą o prostocie ułatwiającej wdrożenie, bez konieczności uruchamiania skomplikowanych narzędzi (jak Node.js czy bundlery). Wszystko jest gotowe do wrzucenia na serwer. 

Ten krótki poradnik krok po kroku przeprowadzi Cię przez proces publikacji oraz zmian na stronie.

## 1. Jak i gdzie umieścić pliki strony?
Aby Twoja nowa strona była widoczna w Internecie, musisz przesłać wygenerowane pliki na swój serwer (hosting).

**Co musisz zrobić zgłaszając się do panelu lub używając klienta FTP (np. FileZilla):**
1. Zaloguj się na swój serwer z danymi otrzymanymi od usługodawcy hostingu.
2. Wejdź do głównego folderu swojej domeny (często nazywa się on `public_html`, `www`, lub po prostu ma nazwę Twojej domeny).
3. **Skopiuj wszystko co masz we folderze roboczym na komputerze (`index.html`, folder `css`, folder `js`, folder `images`, `.htaccess`, `robots.txt`, `sitemap.xml`)** i wrzuć bezpośrednio do tego folderu.
Po wykonaniu tej czynności strona powinna być już widoczna pod Twoim adresem (np. `www.twojadomena.pl`).

## 2. Gdzie i jak podmienić zdjęcia?
Wszystkie zdjęcia docelowo powinny znajdować się w folerze `images`. Obecnie większość ścieżek do zdjęć w kodzie wygląda tak:
`<div ... style="background-image: url('https://lh3.googleusercontent.com/...')">` - to są linki bezpośrednio z zewnętrznych serwerów jak w oryginalnym pliku lub odniesienia do lokalnych jak przy "O Nas".

**Jak je zmienić na własne?**
1. Otwórz plik `index.html` w narzędziu takim jak Notatnik, Visual Studio Code lub dowolnym prostym edytorze tekstu.
2. Skorzystaj z opcji "Szukaj" (Ctrl+F lub Cmd+F) i wpisz frazę: `WSTAW TUTAJ ZDJĘCIE`. 
3. W każdym miejscu z tym komentarzem zobaczysz kod: 
`style="background-image: url('tu-jest-obecny-adres-obrazka');"`
4. Zmień fragment pomiędzy apostrofami na nazwę Twojego zdjęcia, które wcześniej należy skopiować do folderu `images`. Pamiętaj by nazwy nie zawierały spacji:
  ZAMIAST: `url('https://...')`
  ZROB: `url('images/moje-nowe-zdjecie-bramy.jpg')`
5. Pomyśl też o logo - możesz je podmienić szukając frazy `WSTAW TUTAJ ZDJĘCIE LUB KOD SVG TWOJEGO LOGO`.

## 3. Gdzie wstawić skrypty marketingowe (np. Google Analytics, Cookiebot)?
Zadbaliśmy o to, aby instalacja narzędzi była jak najprostsza, a skrypty wizualne (Tailwind) wczytywały się niezależnie od blokady Cookiebota. 

Aby wpiąć własne kody:
1. Otwórz plik `index.html`.
2. Zjedź w kodzie na samą górę do sekcji między `<head>` a `</head>`.
3. Szukaj przygotowanych tam komentarzy dla konkretnych kodów.

**Google Analytics:**
Znajdź linię z napisem `<!-- WSTAW KOD GOOGLE ANALYTICS G-XXXXX TUTAJ -->` i usuń klamry na początku `<!--` i końcu kodu `-->` pod spodem. Zastąp wszystkie "G-XXXXXXX" numerem identyfikacyjnym Twojej usługi, który otrzymasz w panelu Google.

**Cookiebot (Zgoda na ciasteczka):**
Znajdź linię z napisem `<!-- MIEJSCE NA KOD COOKIEBOT -->`. Usuń na chwile obramowania komentarza `<!--` oraz `-->` obejmujące pole z `<script id="Cookiebot"...>` tak jak powyżej i wstaw tam `data-cbid`, który wygenerujesz w swoim koncie na stronie Cookiebota. Kod zignorny dla najważniejszych klas Tailwind ma już odpowiednie przypisywane tagi na stronie, więc strona nie "zepsuje się" graficznie na czas wyrażania zgody przez użytkownika. 

## 4. Edycja nazwy firmy, adresów i SEO.
Zawsze warto poprawić własne adresy pod Google. Otwórz plik `index.html` i:
1. Zmień atrybut `<meta name="description" ...>` by jak najlepiej odzwierciedlał to, w czym jesteś bezkonkurencjny.
2. Zmień teksty "WSTAW SWOJĄ ULICĘ 1" w Schema JSON-LD (aby Google łatwiej pozycjonowało na mapach).

To tyle, masz już gotową stronę podbannera, która zadziała na każdym serwerze współdzielonym!
Powodzenia!
