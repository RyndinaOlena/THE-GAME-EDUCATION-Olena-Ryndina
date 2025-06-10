class ThoughtNotebook {
  constructor() {
    this.thoughts = this.loadThoughts();
    this.initializeElements();
    this.bindEvents();
    this.renderThoughts();
    this.updateUI();
  }

  initializeElements() {
    this.thoughtInput = document.getElementById('thoughtInput');
    this.saveButton = document.getElementById('saveButton');
    this.thoughtsList = document.getElementById('thoughtsList');
    this.emptyState = document.getElementById('emptyState');
    this.charCount = document.getElementById('charCount');
  }

  bindEvents() {
    this.saveButton.addEventListener('click', () => this.saveThought());
    this.thoughtInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.saveThought();
      }
    });
    this.thoughtInput.addEventListener('input', () => this.updateCharCount());
  }

  updateCharCount() {
    const currentLength = this.thoughtInput.value.length;
    const maxLength = 500;
    this.charCount.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength > maxLength * 0.9) {
      this.charCount.style.color = 'var(--danger-color)';
    } else if (currentLength > maxLength * 0.7) {
      this.charCount.style.color = 'var(--primary-color)';
    } else {
      this.charCount.style.color = 'var(--text-light)';
    }

    // Disable save button if empty or too long
    this.saveButton.disabled = currentLength === 0 || currentLength > maxLength;
  }

  saveThought() {
    const content = this.thoughtInput.value.trim();
    
    if (!content) {
      this.showNotification('Будь ласка, введіть вашу думку', 'error');
      return;
    }

    if (content.length > 500) {
      this.showNotification('Думка занадто довга. Максимум 500 символів.', 'error');
      return;
    }

    const thought = {
      id: Date.now().toString(),
      content: content,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.thoughts.unshift(thought);
    this.saveThoughts();
    this.renderThoughts();
    this.clearInput();
    this.updateUI();
    this.showNotification('Думку збережено!', 'success');
  }

  deleteThought(id) {
    const thoughtElement = document.querySelector(`[data-id="${id}"]`);
    
    if (thoughtElement) {
      thoughtElement.classList.add('removing');
      
      setTimeout(() => {
        this.thoughts = this.thoughts.filter(thought => thought.id !== id);
        this.saveThoughts();
        this.renderThoughts();
        this.updateUI();
        this.showNotification('Думку видалено', 'success');
      }, 300);
    }
  }

  renderThoughts() {
    if (this.thoughts.length === 0) {
      this.thoughtsList.innerHTML = '';
      this.emptyState.style.display = 'block';
      return;
    }

    this.emptyState.style.display = 'none';
    
    this.thoughtsList.innerHTML = this.thoughts.map(thought => `
      <div class="thought-item" data-id="${thought.id}">
        <div class="thought-header">
          <span class="thought-date">${thought.date}</span>
          <button class="delete-btn" onclick="notebook.deleteThought('${thought.id}')" 
                  aria-label="Видалити думку" title="Видалити думку">
            🗑️
          </button>
        </div>
        <div class="thought-content">${this.escapeHtml(thought.content)}</div>
      </div>
    `).join('');
  }

  clearInput() {
    this.thoughtInput.value = '';
    this.updateCharCount();
  }

  updateUI() {
    // Update thoughts counter in title if needed
    const thoughtsCount = this.thoughts.length;
    if (thoughtsCount > 0) {
      document.querySelector('.thoughts-title').textContent = `Мої думки (${thoughtsCount})`;
    } else {
      document.querySelector('.thoughts-title').textContent = 'Мої думки';
    }
  }

  loadThoughts() {
    try {
      const stored = localStorage.getItem('thoughts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Помилка завантаження думок:', error);
      return [];
    }
  }

  saveThoughts() {
    try {
      localStorage.setItem('thoughts', JSON.stringify(this.thoughts));
    } catch (error) {
      console.error('Помилка збереження думок:', error);
      this.showNotification('Помилка збереження. Спробуйте ще раз.', 'error');
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius-small);
      box-shadow: var(--shadow-large);
      z-index: 1000;
      animation: slideInFromRight 0.3s ease-out;
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutToRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    
    if (!document.querySelector('#notification-styles')) {
      style.id = 'notification-styles';
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutToRight 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }
}

// Initialize the notebook when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.notebook = new ThoughtNotebook();
});

// Export for potential future use
export { ThoughtNotebook };