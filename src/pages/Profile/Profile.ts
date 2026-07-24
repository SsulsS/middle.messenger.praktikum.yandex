import Handlebars from 'handlebars';
import template from './Profile.hbs?raw';
import './Profile.scss';
import { authService } from '../../utils/auth';

const renderPage = Handlebars.compile(template);

const currentUser = authService.getUser();

if (!currentUser) {
  window.location.href = '/login';
} else {

  const appDiv = document.querySelector<HTMLDivElement>('#app')!;
  const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
  appDiv.className = 'profile';
  appDiv.innerHTML = renderPage({
    username: currentUser.username,
    fullName: fullName || currentUser.username,
    email: currentUser.email || 'не указан',
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    chatName: currentUser.displayName || currentUser.username || currentUser.firstName || '',
    phone: currentUser.phone || 'не указан',
    avatarUrl: currentUser.avatar || (currentUser as any).avatarUrl || '',
  });

  const profileForm = document.getElementById('profile-form') as HTMLFormElement | null;
  const passwordForm = document.getElementById('password-form') as HTMLFormElement | null;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement | null;
  const profileStatus = document.getElementById('profile-status') as HTMLParagraphElement | null;
  const passwordStatus = document.getElementById('password-status') as HTMLParagraphElement | null;


  const openEditBtn = document.getElementById('open-edit-profile') as HTMLButtonElement | null;
  const openPasswordBtn = document.getElementById('open-change-password') as HTMLButtonElement | null;
  const modalProfile = document.getElementById('modal-profile') as HTMLDivElement | null;
  const modalPassword = document.getElementById('modal-password') as HTMLDivElement | null;

  function openModal(modal: HTMLElement | null) {
    if (!modal) return;
    modal.classList.add('modal_open');
    modal.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKeyDown);
  }

  function closeModal(modal: HTMLElement | null) {
    if (!modal) return;
    modal.classList.remove('modal_open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeModal(modalProfile);
      closeModal(modalPassword);
    }
  }


  document.querySelectorAll('[data-modal-close]').forEach((el) =>
    el.addEventListener('click', () => {
      closeModal(modalProfile);
      closeModal(modalPassword);
    }),
  );

  openEditBtn?.addEventListener('click', () => {

    (document.getElementById('edit-first-name') as HTMLInputElement | null)!.value = currentUser.firstName || '';
    (document.getElementById('edit-last-name') as HTMLInputElement | null)!.value = currentUser.lastName || '';
    (document.getElementById('edit-display-name') as HTMLInputElement | null)!.value = (currentUser as any).displayName || '';
    (document.getElementById('edit-login') as HTMLInputElement | null)!.value = currentUser.username || '';
    (document.getElementById('edit-email') as HTMLInputElement | null)!.value = currentUser.email || '';
    (document.getElementById('edit-phone') as HTMLInputElement | null)!.value = currentUser.phone || '';
    openModal(modalProfile);
  });

  openPasswordBtn?.addEventListener('click', () => openModal(modalPassword));

  function showStatus(el: HTMLParagraphElement | null, message: string, isError: boolean) {
    if (!el) return;
    el.textContent = message;
    el.className = isError ? 'profile__status profile__status_error' : 'profile__status profile__status_success';
  }

  function isValidPhone(phone: string) {
    const normalized = phone.replace(/[^\d+]/g, '');
    return /^\+\d{10,15}$/.test(normalized);
  }

  function handleProfileSubmit(event: Event) {
    event.preventDefault();
    if (!profileForm || !currentUser) return;

    const firstName = profileForm.querySelector<HTMLInputElement>('input[name="first_name"]')?.value.trim() || undefined;
    const lastName = profileForm.querySelector<HTMLInputElement>('input[name="second_name"]')?.value.trim() || undefined;
    const displayName = profileForm.querySelector<HTMLInputElement>('input[name="display_name"]')?.value.trim() || undefined;
    const login = profileForm.querySelector<HTMLInputElement>('input[name="login"]')?.value.trim() || undefined;
    const email = profileForm.querySelector<HTMLInputElement>('input[name="email"]')?.value.trim() || undefined;
    const phone = profileForm.querySelector<HTMLInputElement>('input[name="phone"]')?.value.trim() || undefined;
    const avatarFile = profileForm.querySelector<HTMLInputElement>('input[name="avatar"]')?.files?.[0];

    if (phone && !isValidPhone(phone)) {
      showStatus(profileStatus, 'Введите телефон в международном формате: +79001234567', true);
      return;
    }

    const applyUpdate = (avatar?: string) => {
      authService.setUser({
        ...currentUser!,
        firstName: firstName ?? currentUser!.firstName,
        lastName: lastName ?? currentUser!.lastName,
        displayName: displayName ?? currentUser!.displayName,
        username: login ?? currentUser!.username,
        email: email ?? currentUser!.email,
        phone: phone ?? currentUser!.phone,
        ...(avatar ? { avatar } : {}),
      });
      showStatus(profileStatus, 'Данные профиля обновлены', false);
    };

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = () => applyUpdate(reader.result as string);
      reader.readAsDataURL(avatarFile);
    } else {
      applyUpdate();
    }
  }

  function handlePasswordSubmit(event: Event) {
    event.preventDefault();
    if (!passwordForm || !currentUser) return;

    const oldPassword = passwordForm.querySelector<HTMLInputElement>('input[name="old_password"]')?.value.trim() || '';
    const newPassword = passwordForm.querySelector<HTMLInputElement>('input[name="new_password"]')?.value.trim() || '';

    if (!oldPassword || !newPassword) {
      showStatus(passwordStatus, 'Пожалуйста, заполните все поля', true);
      return;
    }

    if (newPassword.length < 6) {
      showStatus(passwordStatus, 'Новый пароль должен быть не менее 6 символов', true);
      return;
    }

    showStatus(passwordStatus, 'Пароль успешно изменён', false);
    passwordForm.reset();
  }

  logoutBtn?.addEventListener('click', () => {
    authService.logout();
    window.location.href = '/login';
  });

  profileForm?.addEventListener('submit', handleProfileSubmit);
  passwordForm?.addEventListener('submit', handlePasswordSubmit);
}