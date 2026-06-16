// Model DSR Manager Logic

async function fetchModelDsrs() {
  try {
    const res = await fetch('/api/model-dsrs', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (!res.ok) throw new Error('Failed to fetch Model DSRs');
    const data = await res.json();
    renderModelDsrTable(data.data || []);
  } catch (err) {
    console.error(err);
  }
}

function renderModelDsrTable(templates) {
  const tbody = document.querySelector('#view-model-dsr tbody');
  if (!tbody) return;
  
  if (templates.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No Model DSRs found.</td></tr>';
    return;
  }
  
  tbody.innerHTML = templates.map(t => {
    let badgeClass = 'bg-gray-200 text-gray-700';
    if (t.status === 'PUBLISHED') badgeClass = 'bg-green-100 text-green-800';
    if (t.status === 'DRAFT') badgeClass = 'bg-blue-100 text-blue-800';
    
    return `
      <tr style="border-bottom: 1px solid var(--border-light);">
        <td style="padding: 12px;"><strong>${t.title}</strong><div style="font-size:11px;color:#888;">v${t.version}</div></td>
        <td style="padding: 12px;"><span class="badge" style="${t.status === 'PUBLISHED' ? 'background:#dcfce7; color:#166534;' : 'background:#e2e8f0; color:#475569;'}">${t.status}</span></td>
        <td style="padding: 12px;">${t.createdBy || 'Admin'}</td>
        <td style="padding: 12px;">${new Date(t.createdAt).toLocaleDateString()}</td>
        <td style="padding: 12px;">
          ${t.status === 'DRAFT' ? `<button class="btn btn-saffron" style="padding: 4px 10px; font-size: 12px;" onclick="publishModelDsr('${t.id}')">Publish</button>` : ''}
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="alert('Viewing Model DSR ${t.id}')">View</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function uploadModelDsr() {
  const nameInput = document.getElementById('model-dsr-name');
  const fileInput = document.getElementById('model-dsr-file');
  
  const title = nameInput.value.trim();
  if (!title) return alert('Please enter a name for the Model DSR');
  
  try {
    // 1. Create Model DSR metadata
    const res = await fetch('/api/model-dsrs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description: 'Uploaded via Admin Panel' })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create Model DSR');
    }
    
    const data = await res.json();
    alert('Model DSR saved successfully!');
    
    // Reset form
    nameInput.value = '';
    fileInput.value = '';
    
    // Refresh table
    fetchModelDsrs();
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function publishModelDsr(id) {
  if (!confirm('Are you sure you want to publish this Model DSR? It will be used for future DSR generations.')) return;
  
  try {
    const res = await fetch(`/api/model-dsrs/${id}/publish`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    
    if (!res.ok) throw new Error('Failed to publish Model DSR');
    
    alert('Model DSR Published successfully!');
    fetchModelDsrs();
  } catch (err) {
    console.error(err);
    alert('Failed to publish Model DSR');
  }
}

// Hook into showView to refresh data when the view is opened
const originalShowView = window.showView;
if (typeof originalShowView === 'function') {
  window.showView = function(viewId, param) {
    originalShowView(viewId, param);
    if (viewId === 'model-dsr') {
      fetchModelDsrs();
    }
  };
}

// Event Listeners for the UI buttons
document.addEventListener('DOMContentLoaded', () => {
  // Update the button onclicks in the UI
  setTimeout(() => {
    const uploadBtn = document.querySelector('#view-model-dsr .btn-primary');
    if (uploadBtn) {
      uploadBtn.onclick = uploadModelDsr;
    }
  }, 1000);
});
