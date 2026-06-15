"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = ["en", "pl"] as const;

export type Language = (typeof LANGUAGES)[number];

type TranslationVars = Record<string, string | number>;

const dictionaries = {
  en: {
    "addCards.ai": "AI",
    "addCards.close": "Close",
    "addCards.manual": "Manual",
    "addCards.open": "Add Cards",
    "addCards.title": "Add Cards",
    "ai.addAccepted": "Add accepted ({count})",
    "ai.count": "Count",
    "ai.error.empty": "Couldn't generate quality cards. Try different text or add manually.",
    "ai.error.failed": "AI generation failed",
    "ai.error.rateLimit": "Rate limited. Please retry after the cooldown ends.",
    "ai.error.saveFailed": "Failed to add generated cards",
    "ai.generate": "Generate",
    "ai.generateMore": "Generate more",
    "ai.generating": "Generating...",
    "ai.generatedAdded": "Added {count} cards",
    "ai.generatedAddedDescription": "You can start studying now or generate more cards for this deck.",
    "ai.retry": "Retry",
    "ai.retryIn": "Retry in {seconds} seconds.",
    "ai.retryInShort": "Retry in {seconds}s",
    "ai.reviewDescription": "All cards are accepted by default. Discard anything you do not want to keep.",
    "ai.reviewTitle": "Review generated cards",
    "ai.sourceText": "Source text",
    "ai.studyNow": "Study now",
    "auth.createAccount": "Create account",
    "auth.createAccountLoading": "Creating account...",
    "auth.createPrompt": "Create your account",
    "auth.email": "Email",
    "auth.login": "Login",
    "auth.password": "Password",
    "auth.passwordHint": "At least 6 characters, with letters and at least one number.",
    "auth.registerSwitch": "Don't have an account? Register",
    "auth.signIn": "Sign in",
    "auth.signInLoading": "Signing in...",
    "auth.signInPrompt": "Sign in to continue",
    "auth.signInSwitch": "Already have an account? Login",
    "auth.supabaseUnavailable": "Could not reach Supabase Auth. Check your connection and Supabase configuration.",
    "auth.success.confirmEmail": "Account created. Check your email to confirm your sign up.",
    "auth.success.signInNow": "Account created. You can now sign in.",
    "cards.add": "Add",
    "cards.adding": "Adding...",
    "cards.back": "Back",
    "cards.cancel": "Cancel",
    "cards.delete": "Delete",
    "cards.deleteCard": "Delete card {name}",
    "cards.deleteConfirm": "Delete \"{name}\"?",
    "cards.edit": "Edit card {name}",
    "cards.editCard": "Edit Card",
    "cards.emptyDescription": "Add your first card to start studying.",
    "cards.emptyTitle": "No cards yet",
    "cards.front": "Front",
    "cards.loadFailed": "Failed to load cards",
    "cards.save": "Save",
    "cards.saving": "Saving...",
    "cards.updateDescription": "Update the front and back of the card.",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.loading": "Loading...",
    "common.retry": "Retry",
    "common.save": "Save",
    "decks.cardsCount": "{count} cards",
    "decks.create": "Create Deck",
    "decks.createDescription": "Create a deck for the topic you want to study.",
    "decks.creating": "Creating...",
    "decks.delete": "Delete deck",
    "decks.deleteAria": "Delete {name}",
    "decks.deleteDescription": "Are you sure? This cannot be undone.",
    "decks.description": "Description",
    "decks.descriptionPlaceholder": "Optional notes about this deck",
    "decks.emptyDescription": "Organize your study material into decks, then add cards manually or with AI.",
    "decks.emptyTitle": "Create your first deck",
    "decks.loadFailed": "Failed to load decks",
    "decks.name": "Name",
    "decks.namePlaceholder": "Biology basics",
    "decks.never": "Never",
    "decks.new": "New Deck",
    "decks.study": "Study",
    "decks.subtitle": "Manage your study sets and add new material.",
    "decks.title": "Your decks",
    "errorBoundary.title": "Something went wrong",
    "errorBoundary.tryAgain": "Try again",
    "language.english": "English",
    "language.label": "Language",
    "language.polish": "Polski",
    "layout.closeNavigation": "Close navigation menu",
    "layout.closeNavigationOverlay": "Close navigation menu overlay",
    "layout.logout": "Logout",
    "layout.loggingOut": "Logging out...",
    "layout.navigation": "Navigation",
    "layout.openNavigation": "Open navigation menu",
    "nav.decks": "Decks",
    "nav.home": "Home",
    "suggestions.accept": "Accept suggestion",
    "suggestions.discard": "Discard suggestion",
    "suggestions.edit": "Edit suggestion",
    "study.backToDeck": "Back to Deck",
    "study.cardProgress": "Card {current} / {total}",
    "study.done": "Done! Reviewed {count} cards",
    "study.knowIt": "Know it",
    "study.leaveSession": "Leave Study Session",
    "study.loadFailed": "Failed to load study cards",
    "study.next": "Next Card",
    "study.nextShort": "Next",
    "study.previous": "Previous card",
    "study.previousShort": "Previous",
    "study.showBack": "Show back of card",
    "study.showFront": "Show front of card",
    "study.shuffle": "Shuffle Cards",
    "study.stillLearning": "Still learning",
    "study.studyAgain": "Study Again",
  },
  pl: {
    "addCards.ai": "AI",
    "addCards.close": "Zamknij",
    "addCards.manual": "Ręcznie",
    "addCards.open": "Dodaj fiszki",
    "addCards.title": "Dodaj fiszki",
    "ai.addAccepted": "Dodaj zaakceptowane ({count})",
    "ai.count": "Liczba",
    "ai.error.empty": "Nie udało się wygenerować dobrych fiszek. Spróbuj innego tekstu albo dodaj je ręcznie.",
    "ai.error.failed": "Generowanie AI nie powiodło się",
    "ai.error.rateLimit": "Limit zapytań. Spróbuj ponownie po zakończeniu odliczania.",
    "ai.error.saveFailed": "Nie udało się dodać wygenerowanych fiszek",
    "ai.generate": "Generuj",
    "ai.generateMore": "Generuj więcej",
    "ai.generating": "Generowanie...",
    "ai.generatedAdded": "Dodano {count} fiszek",
    "ai.generatedAddedDescription": "Możesz zacząć naukę albo wygenerować więcej fiszek dla tej talii.",
    "ai.retry": "Spróbuj ponownie",
    "ai.retryIn": "Spróbuj ponownie za {seconds} s.",
    "ai.retryInShort": "Ponów za {seconds}s",
    "ai.reviewDescription": "Wszystkie fiszki są domyślnie zaakceptowane. Odrzuć te, których nie chcesz zachować.",
    "ai.reviewTitle": "Przejrzyj wygenerowane fiszki",
    "ai.sourceText": "Tekst źródłowy",
    "ai.studyNow": "Ucz się teraz",
    "auth.createAccount": "Utwórz konto",
    "auth.createAccountLoading": "Tworzenie konta...",
    "auth.createPrompt": "Utwórz konto",
    "auth.email": "Email",
    "auth.login": "Zaloguj się",
    "auth.password": "Hasło",
    "auth.passwordHint": "Co najmniej 6 znaków, w tym litery i przynajmniej jedna cyfra.",
    "auth.registerSwitch": "Nie masz konta? Zarejestruj się",
    "auth.signIn": "Zaloguj się",
    "auth.signInLoading": "Logowanie...",
    "auth.signInPrompt": "Zaloguj się, aby kontynuować",
    "auth.signInSwitch": "Masz już konto? Zaloguj się",
    "auth.supabaseUnavailable": "Nie można połączyć się z Supabase Auth. Sprawdź połączenie i konfigurację Supabase.",
    "auth.success.confirmEmail": "Konto utworzone. Sprawdź email, aby potwierdzić rejestrację.",
    "auth.success.signInNow": "Konto utworzone. Możesz się teraz zalogować.",
    "cards.add": "Dodaj",
    "cards.adding": "Dodawanie...",
    "cards.back": "Tył",
    "cards.cancel": "Anuluj",
    "cards.delete": "Usuń",
    "cards.deleteCard": "Usuń fiszkę {name}",
    "cards.deleteConfirm": "Usunąć \"{name}\"?",
    "cards.edit": "Edytuj fiszkę {name}",
    "cards.editCard": "Edytuj fiszkę",
    "cards.emptyDescription": "Dodaj pierwszą fiszkę, aby rozpocząć naukę.",
    "cards.emptyTitle": "Nie ma jeszcze fiszek",
    "cards.front": "Przód",
    "cards.loadFailed": "Nie udało się wczytać fiszek",
    "cards.save": "Zapisz",
    "cards.saving": "Zapisywanie...",
    "cards.updateDescription": "Zaktualizuj przód i tył fiszki.",
    "common.cancel": "Anuluj",
    "common.delete": "Usuń",
    "common.loading": "Ładowanie...",
    "common.retry": "Spróbuj ponownie",
    "common.save": "Zapisz",
    "decks.cardsCount": "{count} fiszek",
    "decks.create": "Utwórz talię",
    "decks.createDescription": "Utwórz talię dla tematu, którego chcesz się uczyć.",
    "decks.creating": "Tworzenie...",
    "decks.delete": "Usuń talię",
    "decks.deleteAria": "Usuń {name}",
    "decks.deleteDescription": "Czy na pewno? Tej operacji nie można cofnąć.",
    "decks.description": "Opis",
    "decks.descriptionPlaceholder": "Opcjonalne notatki o tej talii",
    "decks.emptyDescription": "Uporządkuj materiały w talie, a potem dodaj fiszki ręcznie lub z AI.",
    "decks.emptyTitle": "Utwórz pierwszą talię",
    "decks.loadFailed": "Nie udało się wczytać talii",
    "decks.name": "Nazwa",
    "decks.namePlaceholder": "Podstawy biologii",
    "decks.never": "Nigdy",
    "decks.new": "Nowa talia",
    "decks.study": "Ucz się",
    "decks.subtitle": "Zarządzaj zestawami do nauki i dodawaj nowe materiały.",
    "decks.title": "Twoje talie",
    "errorBoundary.title": "Coś poszło nie tak",
    "errorBoundary.tryAgain": "Spróbuj ponownie",
    "language.english": "English",
    "language.label": "Język",
    "language.polish": "Polski",
    "layout.closeNavigation": "Zamknij menu nawigacji",
    "layout.closeNavigationOverlay": "Zamknij nakładkę menu nawigacji",
    "layout.logout": "Wyloguj",
    "layout.loggingOut": "Wylogowywanie...",
    "layout.navigation": "Nawigacja",
    "layout.openNavigation": "Otwórz menu nawigacji",
    "nav.decks": "Talie",
    "nav.home": "Start",
    "suggestions.accept": "Zaakceptuj sugestię",
    "suggestions.discard": "Odrzuć sugestię",
    "suggestions.edit": "Edytuj sugestię",
    "study.backToDeck": "Wróć do talii",
    "study.cardProgress": "Fiszka {current} / {total}",
    "study.done": "Gotowe! Powtórzono {count} fiszek",
    "study.knowIt": "Umiem",
    "study.leaveSession": "Opuść sesję nauki",
    "study.loadFailed": "Nie udało się wczytać fiszek do nauki",
    "study.next": "Następna fiszka",
    "study.nextShort": "Następna",
    "study.previous": "Poprzednia fiszka",
    "study.previousShort": "Poprzednia",
    "study.showBack": "Pokaż tył fiszki",
    "study.showFront": "Pokaż przód fiszki",
    "study.shuffle": "Wymieszaj fiszki",
    "study.stillLearning": "Jeszcze się uczę",
    "study.studyAgain": "Ucz się ponownie",
  },
} as const;

export type TranslationKey = keyof typeof dictionaries.en;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: TranslationVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "pl";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("aiflashcards-language");
    if (isLanguage(storedLanguage)) {
      setLanguageState(storedLanguage);
      document.documentElement.lang = storedLanguage;
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      setLanguageState(nextLanguage);
      window.localStorage.setItem("aiflashcards-language", nextLanguage);
      document.documentElement.lang = nextLanguage;
    }

    function t(key: TranslationKey, vars: TranslationVars = {}) {
      let text: string = dictionaries[language][key] ?? dictionaries.en[key];

      for (const [name, replacement] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(replacement));
      }

      return text;
    }

    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (context) {
    return context;
  }

  return {
    language: "en" as const,
    setLanguage: () => undefined,
    t: (key: TranslationKey, vars: TranslationVars = {}) => {
      let text: string = dictionaries.en[key];

      for (const [name, replacement] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(replacement));
      }

      return text;
    },
  };
}
